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
      filesystem: { status: "pending" }
    }
  };

  try {
    // Check Python availability
    await checkPython(healthStatus);
    
    // Check OpenCV availability
    await checkOpenCV(healthStatus);
    
    // Check filesystem access
    await checkFilesystem(healthStatus);
    
    // Determine overall status
    const allChecksOk = Object.values(healthStatus.checks).every(
      (check) => check.status === "ok"
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