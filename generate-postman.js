const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

// Import the swagger options from your config
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Crowdfunding Platform API',
      version: '1.0.0',
      description: 'A comprehensive API for a crowdfunding platform with user authentication and project management',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'My Awesome Project' },
            description: { type: 'string', nullable: true, example: 'A description of my project' },
            goalAmount: { type: 'integer', example: 10000 },
            currentAmount: { type: 'integer', nullable: true, example: 2500 },
            creatorId: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
            deadline: { type: 'integer', nullable: true, example: 1672531200 },
            isCompleted: { type: 'boolean', nullable: true, example: false },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'johndoe' },
            password: { type: 'string', example: 'password123' },
          },
        },
        CreateProjectRequest: {
          type: 'object',
          required: ['title', 'goalAmount'],
          properties: {
            title: { type: 'string', example: 'My Awesome Project' },
            description: { type: 'string', example: 'A description of my project' },
            goalAmount: { type: 'integer', example: 10000 },
            deadline: { type: 'integer', example: 1672531200 },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        sessionAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

// Generate the OpenAPI specification
const specs = swaggerJSDoc(options);

// Write the OpenAPI spec to a file
fs.writeFileSync(path.join(__dirname, 'openapi-spec.json'), JSON.stringify(specs, null, 2));

console.log('OpenAPI specification generated: openapi-spec.json');

// Now convert to Postman collection
const Converter = require('openapi-to-postmanv2');

Converter.convert(
  { type: 'json', data: specs },
  {
    folderStrategy: 'Tags',
    collapseFolders: false,
    requestParametersResolution: 'Example',
    exampleParametersResolution: 'Example',
    optimizeConversion: true,
  },
  (err, conversionResult) => {
    if (err) {
      console.error('Error converting to Postman:', err);
      return;
    }

    if (!conversionResult.result) {
      console.error('Conversion failed:', conversionResult.reason);
      return;
    }

    // Write the Postman collection to a file
    const collection = conversionResult.output[0].data;
    fs.writeFileSync(path.join(__dirname, 'postman-collection.json'), JSON.stringify(collection, null, 2));

    console.log('Postman collection generated: postman-collection.json');
    console.log(`Converted ${collection.item?.length || 0} endpoints`);
  }
);