import { ErrorHandler } from 'ask-sdk-core'

export const errorHandler: ErrorHandler = {
  canHandle: () => {
    return true
  },
  handle: (handlerInput, error) => {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse()
  },
}
