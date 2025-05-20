# Image to Oil Paint Converter: Deployment Guide

## Overview

This guide provides instructions for deploying the Image to Oil Paint Converter application to production environments. We've implemented several solutions to address the production issues identified in the `PRODUCTION_FIXES.md` document.

## Deployment Options

### Option 1: Serverless Deployment

We've created a serverless implementation that can be deployed to AWS Lambda or similar services.

#### Steps:

1. **Deploy the Lambda Function**:
   - Navigate to the `serverless` directory
   - Deploy `lambda_function.py` to AWS Lambda with Python 3.8+ runtime
   - Ensure the Lambda function has the following dependencies installed:
     - opencv-python
     - numpy
   - Set appropriate memory (at least 512MB) and timeout (at least 30 seconds)

2. **Configure Environment Variables**:
   - Create a `.env.local` file with the following:
   ```
   SERVERLESS_FUNCTION_URL=https://your-lambda-function-url.amazonaws.com/default/oil-paint-converter
   ```

3. **Update API Route**:
   - The application now includes a serverless-compatible API route at `app/api/serverless-convert/route.ts`
   - Update your frontend to use this endpoint instead of the local Python processing endpoint

### Option 2: Docker Deployment

We've created a Dockerfile that includes both Node.js and Python with OpenCV.

#### Steps:

1. **Build the Docker Image**:
   ```bash
   docker build -t oil-paint-converter .
   ```

2. **Run the Container**:
   ```bash
   docker run -p 3000:3000 oil-paint-converter
   ```

3. **Deploy to Container Service**:
   - Push the image to a container registry (Docker Hub, AWS ECR, etc.)
   - Deploy to a container-friendly hosting service:
     - AWS ECS/EKS
     - Google Cloud Run
     - Azure Container Instances
     - Digital Ocean App Platform

## Environment Variables

The application now supports the following environment variables:

- `PYTHON_PATH`: Path to the Python executable (default: 'python')
- `TEMP_DIR`: Directory for temporary files (default: OS temp directory)
- `DEBUG_MODE`: Enable detailed logging (default: false)
- `SERVERLESS_FUNCTION_URL`: URL of the deployed serverless function

## Error Handling Improvements

We've implemented comprehensive error handling:

1. **Python Script**:
   - Added detailed error logging with traceback information
   - Added file system permission checks
   - Added input/output validation

2. **API Routes**:
   - Added detailed error reporting
   - Added environment information logging
   - Added timeout handling for Python processes

## Health Check

To verify your deployment is working correctly:

1. Access the application in a browser
2. Upload a test image
3. Check server logs for any errors
4. Verify the image conversion completes successfully

## Troubleshooting

### Common Issues

1. **Python Not Found**:
   - Set the `PYTHON_PATH` environment variable to the correct path
   - In Docker, ensure Python is installed in the container

2. **OpenCV Dependencies Missing**:
   - For Docker: The Dockerfile includes necessary dependencies
   - For serverless: Ensure OpenCV is properly installed in the Lambda layer

3. **Temporary Directory Access**:
   - Set the `TEMP_DIR` environment variable to a writable directory
   - Check file permissions in the deployment environment

4. **Process Timeout**:
   - Increase the timeout setting for your serverless function
   - For large images, consider implementing a queue-based processing system

## Monitoring

Implement monitoring to catch issues early:

1. Set up logging to a centralized service (CloudWatch, Datadog, etc.)
2. Create alerts for error rates and response times
3. Implement regular health checks

## Caching Strategy

To improve performance and reduce processing load:

1. Implement client-side caching with appropriate cache headers
2. Consider a CDN for serving processed images
3. Implement server-side caching for frequently requested images