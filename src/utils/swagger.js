import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

// swagger definition
let swaggerDefinition = {
    info: {
        title: 'PSR Generator API Documentation',
        version: '1.0.0',
        description: 'psr generator api documentation',
    },
    host: 'https://psrgenerator.herokuapp.com',
    basePath: '/',
};

// options for the swagger docs
let options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: [path.join(__dirname, '../report/*.js')],
};

// initialize swagger-jsdoc
let swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;