# Generic Gemini V1 Agent - Dockerfile
# This agent uses Google's Gemini API to generate intelligent code responses

FROM node:20-alpine

# Set working directory
WORKDIR /agent

# Copy agent files
COPY agent.ts package.json* ./

# Install dependencies
# If package.json doesn't exist, create it and install @google/generative-ai
RUN if [ -f package.json ]; then \
      npm install; \
    else \
      npm init -y && \
      npm install @google/generative-ai typescript ts-node @types/node; \
    fi

# The agent expects:
# - GEMINI_API_KEY environment variable
# - TASK_DESCRIPTION as first command-line argument
ENTRYPOINT ["npx", "ts-node", "agent.ts"]
