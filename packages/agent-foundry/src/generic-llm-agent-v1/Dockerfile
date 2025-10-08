# Generic LLM Agent v1 - AI-Powered Coding Assistant
# This agent uses Google's Gemini AI to generate code based on natural language requests

FROM node:18-alpine

WORKDIR /workspace

# Install essential tools and dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    python3 \
    py3-pip \
    build-base

# Copy agent code
COPY agent.ts /agent/agent.ts
COPY package.json /agent/package.json

# Set working directory for agent
WORKDIR /agent

# Install Node.js dependencies (including Gemini SDK)
RUN npm install

# Install TypeScript and ts-node globally for execution
RUN npm install -g typescript ts-node

# Create tsconfig.json for ts-node to use CommonJS (fixes export syntax error)
RUN echo '{"compilerOptions":{"module":"commonjs","target":"ES2020","esModuleInterop":true,"skipLibCheck":true,"resolveJsonModule":true},"ts-node":{"transpileOnly":true,"compilerOptions":{"module":"commonjs"}}}' > /agent/tsconfig.json

# Set entrypoint
ENTRYPOINT ["ts-node", "/agent/agent.ts"]
