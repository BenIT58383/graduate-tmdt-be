import winston from 'winston'
import { name, version } from '../../../package.json'
import config from '../config'

// Check environment
const dev = true // config.NODE_ENV !== 'production'
const LOG_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const s3Folder = `${name}_${version}`
// Log option
const options = {
  json: true,
  prettyPrint: true,
  stringify: true,
  timestamp: true,
  handleExceptions: true,
  humanReadableUnhandledException: true,
}

// Declare transport
let transport, transportError, transportHttp

// Instance transport
if (dev) {
  // Transport to console for development environment
  transport = new winston.transports.Console(
    Object.assign({}, options, { level: config.EXPRESS_LOG_LEVEL })
  )

  transportHttp = new winston.transports.Console({ level: 'http' })

  transportError = new winston.transports.Console({ level: 'error' })
}

const enumerateErrorFormat = winston.format((info) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message
    )
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    )
  }

  return info
})

// Winston logging
export default winston.createLogger({
  //setting log timestamp
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp({
      format: LOG_TIMESTAMP_FORMAT,
    }),
    winston.format.json()
  ),
  transports: [transport, transportHttp, transportError],
})
