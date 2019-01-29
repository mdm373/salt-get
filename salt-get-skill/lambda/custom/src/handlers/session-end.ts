import { RequestHandler } from 'ask-sdk-core'
import { SessionEndedRequest } from 'ask-sdk-model'

export const sessionEndedRequestHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle: (handlerInput) => {
    const request = handlerInput.requestEnvelope.request as SessionEndedRequest
    console.log(`Session ended with reason: ${request.reason}`)
    return handlerInput.responseBuilder.getResponse()
  },
}
