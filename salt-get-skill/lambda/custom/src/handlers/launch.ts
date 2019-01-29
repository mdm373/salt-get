import { RequestHandler } from 'ask-sdk-core'
import { skillTitle } from '../common/literals'

export const launchRequestHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle: (handlerInput) => {
    const speechText = 'Welcome to salt get. Wondering if salt is need get?'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(skillTitle, speechText)
      .getResponse()
  },
}
