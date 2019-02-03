import { RequestHandler } from 'ask-sdk-core'
import { skillTitle } from '../common/literals'
import { getSaltQueryText } from '../common/salt-request'

export const launchRequestHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle: async (handlerInput) => {
    const speechText = await getSaltQueryText()

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillTitle, speechText)
      .getResponse()
  },
}
