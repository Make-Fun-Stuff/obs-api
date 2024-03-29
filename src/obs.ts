import OBSWebSocket from 'obs-websocket-js'

let websocket: OBSWebSocket | undefined

const connect = async (socket: OBSWebSocket) => {
  await socket.connect(undefined, 'password')
}

const waitToConnect = async (socket: OBSWebSocket) => {
  let waiting = false
  while (true) {
    try {
      await connect(socket)
      console.log('Connected')
      return
    } catch {
      if (!waiting) {
        console.log('Waiting...')
        waiting = true
      }
    }
  }
}

const checkConnection = async (): Promise<boolean> => {
  if (!websocket) {
    return false
  }
  try {
    await connect(websocket)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const getObsWebsocket = async (): Promise<OBSWebSocket> => {
  if (!websocket || !(await checkConnection())) {
    console.log('Connecting to OBS')
    const obs = new OBSWebSocket()
    await waitToConnect(obs)
    websocket = obs
  }
  return websocket
}
