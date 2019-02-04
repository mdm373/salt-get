## Salt Get Push
>A lambda to push out salt data from the pi client and send SMS warnings when salt runs too low

## Set up
* exec 'npm install'
* in function create, replace role with dynamo enabled arn
* exec 'npm run start' to build and create lambda
* to enable SMS notifications, set `PHONE_NUMBER` environment variable in lambda and grant lambda's IAM role SNS publish access

## Develop
* exec 'npm run deploy' to build and update lambda function code
* exec 'npm run test' build update andinvoke the lambda using the input provided at input.json