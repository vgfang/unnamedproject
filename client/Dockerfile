# Use official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /client

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Install Vite globally
RUN bun add vite -g

# Copy source code
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Run Vite app using Bun
CMD ["bun", "run", "dev"]
