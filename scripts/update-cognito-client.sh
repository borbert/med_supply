#!/bin/bash

# Your Cognito configuration
USER_POOL_ID="us-east-1_hTEmN8MaT"
CLIENT_ID="26uf6hfhtvearh7os8159veibe"
REGION="us-east-1"

# Update the client to enable USER_PASSWORD_AUTH
aws cognito-idp update-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-id $CLIENT_ID \
  --explicit-auth-flows "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" "ALLOW_USER_SRP_AUTH" \
  --region $REGION
