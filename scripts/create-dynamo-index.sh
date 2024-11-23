#!/bin/bash

aws dynamodb update-table \
    --table-name clinic-users \
    --attribute-definitions AttributeName=email,AttributeType=S \
    --global-secondary-index-updates "[{\"Create\":{\"IndexName\": \"email-index\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}], \"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\": 5,\"WriteCapacityUnits\": 5}}}]" \
    --region us-east-1
