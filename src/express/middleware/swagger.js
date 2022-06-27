import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  swaggerDefinition: {
    info: {
      description: 'API Device Monitoring Cloud System',
      version: '1.0.0',
      title: 'API Device Monitoring Cloud System',
    },
    host: `localhost:8081`,
    basePath: '/',
    produces: ['application/json'],
    schemes: ['http'],
  },
  apis: ['./**/*.controller.js'],
}

module.exports = {
  spec() {
    return swaggerJSDoc(options)
  },
}
