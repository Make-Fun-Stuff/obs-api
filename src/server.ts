import express, { Request, Response } from 'express'
import { OBSRequestTypes } from 'obs-websocket-js'
import { getObsWebsocket } from './obs'
import cors from 'cors'

const ip = require('ip')

const supportedOBSCalls: Array<keyof OBSRequestTypes> = [
  'GetSceneList',
  'GetVirtualCamStatus',
  'StartVirtualCam',
  'StopVirtualCam',
  'SetCurrentProgramScene',
]

export const start = (port: number) => {
  const app = express()

  app.disable('etag')
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  )
  app.use(express.json())

  app.get('/', (_, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.send(200).send(JSON.stringify({ supportedOBSCalls }))
  })

  supportedOBSCalls.forEach((obsCall) => {
    const handler = async (request: Request, response: Response) => {
      console.log(`\nReceived request to ${obsCall} at ${new Date().toISOString()}`)
      response.setHeader('Content-Type', 'application/json')
      try {
        const obs = await getObsWebsocket()
        const obsResponse = await obs.call(obsCall, request.body)
        console.log(obsResponse)
        response.status(200).send(obsResponse || {})
      } catch (error) {
        console.error(error)
        response.status(500).send({ error })
      }
    }
    console.log(`Adding handler for /${obsCall}`)
    app[obsCall.startsWith('Get') ? 'get' : 'post'](`/${obsCall}`, handler)
  })

  const ipAddress = ip.address()
  getObsWebsocket().then((_) =>
    app.listen(port, ipAddress, () => {
      console.log(`OBS API started: http://${ipAddress}:${port}`)
    })
  )
}
