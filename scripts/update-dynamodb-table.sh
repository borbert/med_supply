#!/bin/bash

# Your DynamoDB configuration
TABLE_NAME="clinic-users"
REGION="us-east-1"

# Update the table to add the email-index
aws dynamodb update-table \
    --table-name $TABLE_NAME \
    --attribute-definitions AttributeName=email,AttributeType=S \
    --global-secondary-indexes \
        "[{\"IndexName\": \"email-index\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}], \
          \"Projection\":{\"ProjectionType\":\"ALL\"}, \
          \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}}]" \
    --region $REGION
