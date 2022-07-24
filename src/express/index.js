import express from 'express'
import compress from 'compression'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import bodyParser from 'body-parser'
import cors from 'cors'
import expressErrorHandler from './middleware/error-handler'
import routes from '../api/router'
import config from '../common/config/index'
import authorityCheck from '../express/middleware/authority-check'
import expressWinston from 'express-winston'
import logger from '../common/utils/logger'
const path = require('path');

const app = express()

const publicPath = path.join(__dirname, "../../src/images");
app.use("/src/images", express.static(publicPath));

// Check environment
// const dev = config.NODE_ENV !== 'production'
const dev = true
// handle logic here

// job.runTransferData()
// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: '2000kb' }))

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

// 400 - Bad request Invalid json
app.use((err, req, res, next) => {
  console.log(req.headers, 'Request headers')
  console.log(err)
  if (err.status === 400) {
    res.status(err.status).json({
      error: {
        message: 'COMMON_ERR_002',
        errors: {
          messages: ['Invalid json'],
          type: err.type,
        },
      },
    })
  }
  next()
})
// Compress response
// app.use(compress())

// Cross-Origin Resource Sharing
// var allowlist = config.ALLOW_CORS.split(',')
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

app.use(cors('*'))

// secure apps by setting various HTTP headers
app.use(helmet())

// Development envionrment setting
if (dev) {
  // enable detailed API logging in dev env
  expressWinston.responseWhitelist.push('body')
}

// Use Winston logging middleware
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    level: 'http',
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    statusLevels: true,
    requestWhitelist: expressWinston.requestWhitelist.concat('body'),
  })
)
// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Ecommerce BE?',
    version: '1.0.0',
    description: 'Define Api for Ecommerce Report',
  },
  host: 'localhost:8081',
  basePath: '/',
  components: {
    securitySchemes: {
      jwt: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      jwt: [],
    },
  ],
  openapi: '3.0.0',
}

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./src/api/routes.js', './src/api/*/router.js'],
}

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options)

// eslint-disable-next-line prettier/prettier
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})
app.use('/health-check', async (req, res) => {
  return res.send({ 'health-check': 'OK' })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/simple-cors', cors(), (req, res) => {
  // eslint-disable-next-line no-console
  console.info('GET /simple-cors')
  res.json({
    text: 'Simple CORS requests are working. [GET]',
  })
})
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
// app.use(authorityCheck)

// Mount all api routes
app.use('/', routes)

// Handle error middleware
app.use(expressErrorHandler)
export default app
