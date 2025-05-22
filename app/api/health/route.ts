import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { join } from "path";

// Define types for health status
type EnvironmentType = "development" | "production" | "test";

interface CheckStatus {
  status: string;
  version?: string;
  error?: string;
  tempDir?: string;
}

interface HealthStatus {
  status: string;
  timestamp: string;
  environment: EnvironmentType;
  error?: string;
  checks: {
    python: CheckStatus;
    opencv: CheckStatus;
    filesystem: CheckStatus;
    serverlessOilPaint?: CheckStatus;
  };
}

interface CommandResult {
  stdout: string;
  stderr: string;
}

// Environment configuration
const pythonPath = process.env.PYTHON_PATH || 'python';

/**
 * Health check endpoint to verify the application's dependencies are working correctly
 * GET /api/health
 */
export async function GET() {
  const healthStatus: HealthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: (process.env.NODE_ENV as EnvironmentType) || "development",
    checks: {
      python: { status: "pending" },
      opencv: { status: "pending" },
      filesystem: { status: "pending" },
      serverlessOilPaint: { status: "pending" }
    }
  };

  try {
    // Check Python availability
    await checkPython(healthStatus);
    
    // Check OpenCV availability
    await checkOpenCV(healthStatus);
    
    // Check filesystem access
    await checkFilesystem(healthStatus);

    // Check serverless function
    await checkServerlessFunction(healthStatus);
    
    // Determine overall status
    const allChecksOk = Object.values(healthStatus.checks).every(
      (check) => check.status === "ok" || check.status === "not_configured"
    );
    
    healthStatus.status = allChecksOk ? "ok" : "degraded";
    
    return NextResponse.json(healthStatus, {
      status: allChecksOk ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    healthStatus.status = "error";
    healthStatus.error = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(healthStatus, {
      status: 500,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  }
}

async function checkPython(healthStatus: HealthStatus) {
  try {
    const result = await runCommand(pythonPath, ["--version"]);
    healthStatus.checks.python = {
      status: "ok",
      version: result.stdout.trim()
    };
  } catch (error) {
    healthStatus.checks.python = {
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function checkOpenCV(healthStatus: HealthStatus) {
  try {
    // Note: This path relies on process.cwd() being the project root at runtime.
    // This is typically the case in standard Next.js deployments.
    const scriptPath = join(process.cwd(), "scripts", "check_opencv.py");
    const result = await runCommand(pythonPath, [scriptPath]);
    healthStatus.checks.opencv = {
      status: "ok",
      version: result.stdout.trim()
    };
  } catch (error) {
    healthStatus.checks.opencv = {
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function checkFilesystem(healthStatus: HealthStatus) {
  try {
    const { tmpdir } = await import("os");
    const { writeFile, unlink } = await import("fs/promises");
    const { v4: uuidv4 } = await import("uuid");
    
    const testFile = join(tmpdir(), `health-check-${uuidv4()}.txt`);
    await writeFile(testFile, "Health check test");
    await unlink(testFile);
    
    healthStatus.checks.filesystem = {
      status: "ok",
      tempDir: tmpdir()
    };
  } catch (error) {
    healthStatus.checks.filesystem = {
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function runCommand(command: string, args: string[]): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    let stdout = "";
    let stderr = "";
    
    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    process.on("error", (err) => {
      reject(err);
    });
    
    process.on("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Process exited with code ${code}: ${stderr}`));
      }
    });
    
    // Set a timeout to prevent hanging
    setTimeout(() => {
      process.kill();
      reject(new Error("Command timed out after 5 seconds"));
    }, 5000);
  });
}

async function checkServerlessFunction(healthStatus: HealthStatus) {
  const lambdaUrl = process.env.SERVERLESS_FUNCTION_URL;

  if (!lambdaUrl) {
    healthStatus.checks.serverlessOilPaint = {
      status: "not_configured",
      error: "SERVERLESS_FUNCTION_URL is not set"
    };
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7-second timeout

    const response = await fetch(lambdaUrl, { 
      method: 'GET', 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);

    if (response.ok && response.status === 200) {
      try {
        const parsedJson = await response.json();
        healthStatus.checks.serverlessOilPaint = {
          status: "ok",
          // Assuming the lambda's GET response has a 'message' or similar field
          version: parsedJson.message || (parsedJson.status === "healthy" ? "operational" : "unknown") 
        };
      } catch (jsonError) {
        healthStatus.checks.serverlessOilPaint = {
          status: "error",
          error: `Failed to parse JSON response from ${lambdaUrl}: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`
        };
      }
    } else {
      const errorText = await response.text();
      healthStatus.checks.serverlessOilPaint = {
        status: "error",
        error: `Serverless function at ${lambdaUrl} returned status ${response.status}: ${errorText}`
      };
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      healthStatus.checks.serverlessOilPaint = {
        status: "error",
        error: `Request to ${lambdaUrl} timed out after 7 seconds.`
      };
    } else {
      healthStatus.checks.serverlessOilPaint = {
        status: "error",
        error: `Failed to fetch ${lambdaUrl}: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}