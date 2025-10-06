# packages/agent-foundry/src/sentinel-jest-ts/Dockerfile
FROM node:20-slim

WORKDIR /app

# Install dependencies required to run tests.
# We will mount the project's package.json and lockfile.
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# The agent's own logic will be mounted as a volume.
WORKDIR /project

# The entrypoint will be the test command itself.
ENTRYPOINT ["npx", "jest"]
