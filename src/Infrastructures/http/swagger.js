import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Forum API',
      version: '1.0.0',
      description: 'Complete API Documentation for Forum Application with Clean Architecture',
      contact: {
        name: 'Forum API Support',
        email: 'support@forum.local',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://api.forum.local',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token for authenticated endpoints',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
            },
            username: {
              type: 'string',
              description: 'Unique username',
            },
            fullname: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              description: 'User email address',
            },
          },
        },
        Thread: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique thread identifier',
            },
            title: {
              type: 'string',
              description: 'Thread title',
            },
            body: {
              type: 'string',
              description: 'Thread content',
            },
            owner: {
              type: 'string',
              description: 'User ID of thread creator',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Thread creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique comment identifier',
            },
            content: {
              type: 'string',
              description: 'Comment content',
            },
            owner: {
              type: 'string',
              description: 'User ID of comment creator',
            },
            threadId: {
              type: 'string',
              description: 'ID of the thread this comment belongs to',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Comment creation timestamp',
            },
            isDelete: {
              type: 'boolean',
              description: 'Whether comment has been deleted',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['success'],
            },
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'JWT access token',
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['fail', 'error'],
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [],
  },
  apis: [
    './src/Interfaces/http/api/users/swagger.js',
    './src/Interfaces/http/api/authentications/swagger.js',
    './src/Interfaces/http/api/threads/swagger.js',
    './src/Interfaces/http/api/comments/swagger.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
