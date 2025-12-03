#!/usr/bin/env bash

# Load variables from the .env file into the current shell so they're available to kamal and other commands.
# NOTE: This script must be *sourced*, not executed, e.g.:
#   source load-env.sh
# or
#   . ./load-env.sh

# Add the necessary variables used by ./config/deploy.yml to .env file, e.g:
# - GITHUB_REPOSITORY=org/repo         # Repo name used to derive image/service name and folder paths
# - KAMAL_DEPLOY_IP=100.100.100.100    # IP address of server to deploy to
# - KAMAL_DEPLOY_HOST=www.example.org  # domain name of website
# - KAMAL_REGISTRY_USERNAME=user       # Container registry credentials (for ghcr.io)
# - GITHUB_PACKAGES_TOKEN=ghp_xxx      
# Login with:
# echo $KAMAL_REGISTRY_PASSWORD | docker login ghcr.io -u mythz --password-stdin

# If this script is run directly (./load-env.sh), print a warning because
# environment changes will not persist in the parent shell.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  echo "[load-env] This script must be sourced to affect the current shell:" >&2
  echo "  source load-env.sh" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[load-env] No .env file found at: $ENV_FILE" >&2
  return 1
fi

# Auto-export all variables defined while the script runs
set -a
source "$ENV_FILE"
set +a

echo "[load-env] Loaded environment variables from $ENV_FILE"
