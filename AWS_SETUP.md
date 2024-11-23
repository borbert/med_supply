# AWS Infrastructure Setup Guide

## 1. DynamoDB Tables Setup

Log into AWS Console and create the following DynamoDB tables:

### Users Table (clinicsupply-users)
- Partition Key: id (String)
- GSI: EmailIndex
  * Partition Key: email (String)
- GSI: ClinicIndex
  * Partition Key: clinicId (String)

### Clinics Table (clinicsupply-clinics)
- Partition Key: id (String)

### Products Table (clinicsupply-products)
- Partition Key: id (String)
- GSI: CategoryIndex
  * Partition Key: category (String)

### Orders Table (clinicsupply-orders)
- Partition Key: id (String)
- GSI: ClinicOrdersIndex
  * Partition Key: clinicId (String)
  * Sort Key: createdAt (String)
- GSI: UserOrdersIndex
  * Partition Key: userId (String)
  * Sort Key: createdAt (String)
- GSI: StatusIndex
  * Partition Key: status (String)
  * Sort Key: createdAt (String)

### Templates Table (clinicsupply-templates)
- Partition Key: id (String)
- GSI: ClinicTemplatesIndex
  * Partition Key: clinicId (String)

### Settings Table (clinicsupply-settings)
- Partition Key: id (String)
- GSI: TypeIndex
  * Partition Key: type (String)
- GSI: OwnerIndex
  * Partition Key: ownerId (String)

For all tables:
- Use on-demand capacity
- Enable point-in-time recovery
- Enable server-side encryption with AWS managed key

## 2. Cognito User Pool Setup

1. Create User Pool
   - Pool name: clinicsupply-users
   - Enable email sign-in
   - Enable custom attributes:
     * clinicId (String)
     * role (String)
   - Password policy: Configure as needed
   - MFA: Optional (as per requirements)

2. Create App Client
   - Client name: clinicsupply-web
   - Generate client secret: No
   - Enable all OAuth flows
   - Callback URL: http://localhost:3000/api/auth/callback/cognito (for development)

## 3. IAM User Setup

1. Create new IAM User
   - Name: clinicsupply-app
   - Access type: Programmatic access

2. Create and attach policy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:*:table/clinicsupply-*",
                "arn:aws:dynamodb:*:*:table/clinicsupply-*/index/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminDeleteUser",
                "cognito-idp:AdminUpdateUserAttributes",
                "cognito-idp:AdminGetUser"
            ],
            "Resource": [
                "arn:aws:cognito-idp:*:*:userpool/*"
            ]
        }
    ]
}
```

## 4. Environment Variables

Create a `.env.local` file in your project root with these variables:
```bash
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=<your-access-key>
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=<your-secret-key>

# Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<your-user-pool-id>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<your-client-id>

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-random-secret>
```

## Next Steps

After completing the AWS setup:
1. Create the `.env.local` file with your credentials
2. Run the data seeding scripts
3. Test the authentication flow

Please ensure all AWS resources are created in the same region (us-east-1 recommended for consistency).
