# Drone Generic v1 - General-purpose coding agent
# Handles generic programming tasks across multiple languages

FROM node:18-alpine

WORKDIR /workspace

# Install common development tools
RUN apk add --no-cache \
    git \
    curl \
    bash \
    python3 \
    py3-pip \
    build-base

# Copy agent code
COPY agent.ts /agent/agent.ts

# Install TypeScript globally for execution
RUN npm install -g typescript ts-node

# Create tsconfig.json for ts-node to use CommonJS (fixes export syntax error)
RUN echo '{"compilerOptions":{"module":"commonjs","target":"ES2020","esModuleInterop":true,"skipLibCheck":true},"ts-node":{"transpileOnly":true,"compilerOptions":{"module":"commonjs"}}}' > /agent/tsconfig.json

# Set up entrypoint
ENTRYPOINT ["ts-node", "/agent/agent.ts"]
