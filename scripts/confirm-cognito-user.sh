#!/bin/bash

# Your Cognito configuration
USER_POOL_ID="us-east-1_hTEmN8MaT"
REGION="us-east-1"
USERNAME="borbert_1732305563463_3buz86"  # This is the username from your signup logs

# Confirm the user
aws cognito-idp admin-confirm-sign-up \
    --user-pool-id $USER_POOL_ID \
    --username $USERNAME \
    --region $REGION
