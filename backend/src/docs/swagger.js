const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load Swagger specification from YAML file
const swaggerDocument = YAML.load(path.resolve(__dirname, 'swagger.yaml'));

function setupSwagger(app) {
  // Mount Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = setupSwagger;