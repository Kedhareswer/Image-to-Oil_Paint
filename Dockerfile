FROM node:18-slim

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy Python requirements and install Python dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Build the Next.js application
RUN npm run build

# Set environment variables
ENV PYTHON_PATH=/usr/bin/python3
ENV TEMP_DIR=/tmp
ENV DEBUG_MODE=false

# Start the application
CMD ["npm", "start"]