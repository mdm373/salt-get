## Salt Get Push
>A lambda to push out salt data from the pi client

## Set up
* exec 'npm install'
* in function create, replace role with dynamo enabled arn
* exec 'npm run start' to build and create lambda

## Develop
* exec 'npm run deploy' to build and update lambda function code
* exec 'npm run test' build update andinvoke the lambda using the input provided at input.json