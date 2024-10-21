# Use official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /server

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port for the backend API
EXPOSE 3000

# Run the backend app using Bun
CMD ["bun", "run", "--hot", "index.ts"]
