# Stage 1: The Builder
# This stage installs all dependencies and compiles our TypeScript code.
FROM node:20-slim AS builder

WORKDIR /app

# Install necessary dependencies for compilation
COPY package.json package-lock.json* ./
RUN npm install --include=dev || (npm init -y && npm install @google/generative-ai typescript @types/node)

# Copy the agent's source code
COPY src/ ./src/

# Compile the TypeScript code to JavaScript
RUN npx tsc -p tsconfig.json

# Stage 2: The Runner
# This is the final, optimized image that will be run.
FROM node:20-slim

WORKDIR /agent

# Copy only the necessary production node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the compiled JavaScript output from the builder stage
COPY --from=builder /app/dist ./

# The agent expects:
# - GEMINI_API_KEY environment variable
# - TASK_DESCRIPTION as first command-line argument
CMD ["node", "agent.js"]
