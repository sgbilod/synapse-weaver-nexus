#!/bin/bash

# Setup script for the Synapse Weaver Nexus project

# Exit immediately if a command exits with a non-zero status
set -e

# Function to install dependencies for all packages
install_dependencies() {
  echo "Installing dependencies for all packages..."
  pnpm install
}

# Function to build all packages
build_packages() {
  echo "Building all packages..."
  pnpm run build
}

# Function to run tests
run_tests() {
  echo "Running tests..."
  pnpm test
}

# Main script execution
echo "Setting up the Synapse Weaver Nexus project..."

install_dependencies
build_packages
run_tests

echo "Setup complete!"