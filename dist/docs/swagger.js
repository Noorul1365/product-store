"use strict";
// src/docs/swagger.ts (Must be JS file if using swagger-autogen directly)
const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Appointment Booking',
        description: 'API documentation for appointment platform',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    tags: [
        { name: 'User', description: 'User related endpoints' },
        { name: 'Admin', description: 'product related endpoints' },
    ],
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./dist/index.js']; // compiled output from TypeScript
swaggerAutogen(outputFile, endpointsFiles, doc);
