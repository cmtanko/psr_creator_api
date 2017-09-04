'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _swaggerJsdoc = require('swagger-jsdoc');

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'PSR Generator API Documentation',
        version: '1.0.0',
        description: 'psr generator api documentation'
    },
    host: 'https://psrgenerator.herokuapp.com',
    basePath: '/'
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: [_path2.default.join(__dirname, '../report/*.js')]
};

// initialize swagger-jsdoc
var swaggerSpec = (0, _swaggerJsdoc2.default)(options);

exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map