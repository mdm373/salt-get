# Salt Get Skill
> Built with ASK CLI

## Set Up

* Build Ask Get Dynamo Project for dynamo dependencies. 
* Run ask deploy for first time deployment
* Grant lambda IAM role dynamodb read access
* Set lambda environment variable "DEVICE_ID" to any unique value matching device id assigned in salt get client environment
* From custom/lambda run "npm run deploy" to build and upload skill lambda
* Click [here](./instructions/7-cli.md) for instructions using the ASK CLI (command line interface).

## Additional Resources

### Community
* [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/165/index.html) - Join the conversation!
* [Hackster.io](https://www.hackster.io/amazon-alexa) - See what others are building with Alexa.

### Tutorials & Guides
* [Voice Design Guide](https://developer.amazon.com/designing-for-voice/) - A great resource for learning conversational and voice user interface design.
* [Codecademy: Learn Alexa](https://www.codecademy.com/learn/learn-alexa) - Learn how to build an Alexa Skill from within your browser with this beginner friendly tutorial on Codecademy!

### Documentation
* [Official Alexa Skills Kit Node.js SDK](https://www.npmjs.com/package/ask-sdk) - The Official Node.js SDK Documentation
*  [Official Alexa Skills Kit Documentation](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html) - Official Alexa Skills Kit Documentation
