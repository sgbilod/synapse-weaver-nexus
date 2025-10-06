FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the application (if applicable)
RUN pnpm build

# Expose the application port (change as necessary)
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]