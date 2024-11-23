#!/bin/bash

# Your Cognito configuration
USER_POOL_ID="us-east-1_hTEmN8MaT"
REGION="us-east-1"
EMAIL="borbert@hotmail.com"

# Update the user's attributes
aws cognito-idp admin-update-user-attributes \
    --user-pool-id $USER_POOL_ID \
    --username $EMAIL \
    --user-attributes Name=email_verified,Value=true \
    --region $REGION
