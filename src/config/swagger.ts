// import type { Application } from "express"
// import swaggerJsdoc from "swagger-jsdoc"
// import swaggerUi from "swagger-ui-express"

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Node.js TypeScript API",
//       version: "1.0.0",
//       description: "Professional REST API with Socket.IO, MongoDB, Redis, and JWT Authentication",
//     },
//     servers: [
//       {
//         url: `http://localhost:${process.env.PORT || 8000}`,
//         description: "Development server",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//         cookieAuth: {
//           type: "apiKey",
//           in: "cookie",
//           name: "accessToken",
//         },
//       },
//     },
//   },
//   apis: ["./src/routes/*.ts", "./src/models/*.ts"],
// }

// const specs = swaggerJsdoc(options)

// export const setupSwagger = (app: Application): void => {
//   app.use(
//     "/api-docs",
//     swaggerUi.serve,
//     swaggerUi.setup(specs, {
//       customCss: ".swagger-ui .topbar { display: none }",
//       customSiteTitle: "API Documentation",
//     }),
//   )
// }
import type { Application } from "express"
import swaggerJsdoc from "swagger-jsdoc"
import type { OpenAPIV3 } from "openapi-types"
import swaggerUi from "swagger-ui-express"


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js TypeScript API",
      version: "1.0.0",
      description: "Professional REST API with Socket.IO, MongoDB, Redis, and JWT Authentication",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
}

// const specs = swaggerJsdoc(options)
const specs = swaggerJsdoc(options) as OpenAPIV3.Document

specs.paths = specs.paths || {}
specs.paths["/socket.io"] = {
  get: {
    tags: ["Socket.IO"],
    summary: "Socket.IO Connection Documentation",
    description: `
## Socket.IO Real-time API

### Connection
Connect to: \`ws://localhost:${process.env.PORT || 8000}\`

### Authentication
Socket.IO connection requires JWT token:
\`\`\`javascript
const socket = io('http://localhost:8000', {
  auth: {
    token: 'your-jwt-token'
  }
});
\`\`\`

### Request Format
All socket requests follow this structure:
\`\`\`json
{
  "type": "serviceName",     // Service name from registry
  "action": "actionName",    // Action to perform
  "payload": {               // Request data
    // Your data here
  }
}
\`\`\`

### Response Format
\`\`\`json
{
  "status": true,           // Success status
  "msg": "success_message", // Message key
  "data": {},               // Response data
  "errors": [],             // Error messages
  "request": {}             // Original request
}
\`\`\`

### Available Services

#### 1. UG Course Service (\`type: "ugCourseService"\`)
- **list** - Get list of UG courses
- **create** - Create new course
- **update** - Update existing course
- **delete** - Soft delete course

#### 2. User Service (\`type: "userService"\`)
- **list** - Get list of users
- **update** - Update user
- **getById** - Get user by ID

### Example Usage
\`\`\`javascript
// List UG courses
socket.emit('api-request', {
  type: 'ugCourseService',
  action: 'list',
  payload: {
    query: 'computer',
    page: 1,
    limit: 10
  }
});

// Listen for response
socket.on('api-response', (response) => {
  console.log(response.data);
});
\`\`\`
    `,
    responses: {
      200: {
        description: "Socket.IO documentation",
      },
    },
  },
}

export const setupSwagger = (app: Application): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "API Documentation",
    }),
  )
}
