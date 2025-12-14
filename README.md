# Node.js TypeScript Backend

Professional Node.js + TypeScript backend with REST APIs, Socket.IO type-action system, MongoDB, Redis, JWT authentication, and role-based permissions.

## Features

✅ **TypeScript** - Full type safety
✅ **Express.js** - REST API framework
✅ **Socket.IO** - Real-time communication with authentication
✅ **MongoDB** - Database with Mongoose ODM
✅ **Redis** - Caching for faster APIs
✅ **JWT Authentication** - Access, Refresh, and Guest tokens
✅ **Cookie-based Auth** - Secure HTTP-only cookies
✅ **Role-Based Permissions** - Admin, User, Guest, Public
✅ **Swagger Documentation** - Interactive API docs
✅ **Pagination Utility** - Reusable pagination
✅ **Clean Architecture** - Separated concerns (routes, controllers, services, models)
✅ **Error Handling** - Centralized error handler
✅ **Security** - Helmet, CORS, rate limiting

## Project Structure

\`\`\`
src/
├── config/          # Database, Redis, Swagger configuration
├── constants/       # Messages and constants
├── controllers/     # Request handlers
├── middleware/      # Auth, permissions, caching, error handling
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
│   └── socket/      # Socket.IO services
├── socket/          # Socket.IO setup and handlers
├── types/           # TypeScript types and interfaces
├── utils/           # Utilities (JWT, pagination, permissions, response)
└── index.ts         # Entry point
\`\`\`

## Installation

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Setup environment variables:**
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. **Start MongoDB and Redis:**
\`\`\`bash
# MongoDB
mongod

# Redis
redis-server
\`\`\`

4. **Run development server:**
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/guest-token` - Generate guest token
- `GET /api/auth/profile` - Get user profile (Protected)

### Users (Protected)

- `GET /api/users` - Get all users (Admin only, with pagination)
- `GET /api/users/:id` - Get user by ID (User+)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Socket.IO Type-Action System

This backend implements a powerful type-action based Socket.IO system for structured real-time communication.

### Request Format

All Socket.IO requests follow this structure:

\`\`\`javascript
{
  "type": "serviceName",      // Service to call (e.g., "ugCourseService", "userService")
  "action": "actionName",     // Action to execute (e.g., "list", "update", "create")
  "payload": {                // Action-specific data
    // Your data here
  }
}
\`\`\`

### Response Format

All responses follow this structure:

\`\`\`javascript
{
  "status": true,             // Success/failure boolean
  "msg": "message_key",       // Message identifier
  "data": { },                // Response data (optional)
  "errors": [],               // Error array (empty if successful)
  "request": { }              // Echo of original request
}
\`\`\`

### Available Services

#### 1. UG Course Service (`ugCourseService`)

**List Courses:**
\`\`\`javascript
socket.emit('request', {
  type: 'ugCourseService',
  action: 'list',
  payload: {
    query: '',              // Search query (optional)
    limit: '10',            // Items per page
    page: '1'               // Page number
  }
}, (response) => {
  console.log(response.data.items);           // Course array
  console.log(response.data.totalCount);      // Total courses
  console.log(response.data.paginationData);  // Pagination info
});
\`\`\`

**Create Course:**
\`\`\`javascript
socket.emit('request', {
  type: 'ugCourseService',
  action: 'create',
  payload: {
    course_name: 'MBBS',
    description: 'Medical course',
    fees: 700,
    order_index: 1
  }
}, (response) => {
  console.log(response.data);  // Created course
});
\`\`\`

**Update Course:**
\`\`\`javascript
socket.emit('request', {
  type: 'ugCourseService',
  action: 'update',
  payload: {
    id: '680875e5f5478efb4c74ad6c',
    course_name: 'Updated Name',
    fees: 800
  }
}, (response) => {
  console.log(response.data);  // Updated course
});
\`\`\`

**Delete Course:**
\`\`\`javascript
socket.emit('request', {
  type: 'ugCourseService',
  action: 'delete',
  payload: {
    id: '680875e5f5478efb4c74ad6c'
  }
}, (response) => {
  console.log(response.msg);  // 'course_deleted_successfully'
});
\`\`\`

#### 2. User Service (`userService`)

**List Users:**
\`\`\`javascript
socket.emit('request', {
  type: 'userService',
  action: 'list',
  payload: {
    query: '',
    limit: '10',
    page: '1'
  }
}, (response) => {
  console.log(response.data.items);  // Users array
});
\`\`\`

**Update User:**
\`\`\`javascript
socket.emit('request', {
  type: 'userService',
  action: 'update',
  payload: {
    id: '6912d8e6d27357cbd329afee',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com'
  }
}, (response) => {
  console.log(response.data);  // Updated user
});
\`\`\`

**Get User by ID:**
\`\`\`javascript
socket.emit('request', {
  type: 'userService',
  action: 'getById',
  payload: {
    id: '6912d8e6d27357cbd329afee'
  }
}, (response) => {
  console.log(response.data);  // User object
});
\`\`\`

### Socket.IO Connection with JWT

\`\`\`javascript
import { io } from 'socket.io-client';

// Get token from login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const token = data.accessToken;

// Connect to Socket.IO with token
const socket = io('http://localhost:5000', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('Connected!');
  
  // Now you can make requests
  socket.emit('request', {
    type: 'ugCourseService',
    action: 'list',
    payload: { query: '', limit: '10', page: '1' }
  }, (response) => {
    console.log(response);
  });
});
\`\`\`

### Client Examples

See the `examples/` folder for complete client implementations:

- **HTML Client** (`examples/socket-client.html`) - Browser-based testing interface
- **TypeScript Client** (`examples/socket-client.ts`) - Node.js client class with examples

To use the HTML client:
\`\`\`bash
# Open in browser
open examples/socket-client.html
\`\`\`

To use the TypeScript client:
\`\`\`bash
npx tsx examples/socket-client.ts
\`\`\`

### Adding New Services

1. Create service file in `src/services/socket/`:

\`\`\`typescript
// src/services/socket/my-service.service.ts
import type { SocketResponse } from "../../types/socket.types"
import { SocketResponseUtil } from "../../utils/socket-response.util"

export class MyService {
  static async myAction(payload: any, request: any): Promise<SocketResponse> {
    try {
      // Your logic here
      return SocketResponseUtil.success("success_message", data, request)
    } catch (error) {
      return SocketResponseUtil.error("error_message", [error.message], request)
    }
  }
}
\`\`\`

2. Register in `src/sockets/service-registry.ts`:

\`\`\`typescript
import { MyService } from "../services/socket/my-service.service"

export const serviceRegistry: ServiceRegistry = {
  // ... existing services
  myService: {
    myAction: MyService.myAction,
  },
}
\`\`\`

3. Use from client:

\`\`\`javascript
socket.emit('request', {
  type: 'myService',
  action: 'myAction',
  payload: { /* your data */ }
}, (response) => {
  console.log(response);
});
\`\`\`

## Socket.IO Events (Legacy)

### Public Events (No auth required)
- `public:message` - Send public message
- `public:message:response` - Receive public response

### Guest Events (Guest token or higher)
- `guest:ping` - Send ping
- `guest:pong` - Receive pong

### Private Events (Authenticated users only)
- `private:message` - Send private message
- `private:message:response` - Receive private response

### Admin Events (Admin only)
- `admin:broadcast` - Broadcast to all users
- `admin:announcement` - Receive admin announcements

### Room Management
- `join:room` - Join a room
- `room:joined` - Confirmation of room join

## Authentication Flow

### 1. Register/Login
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
\`\`\`

Tokens are automatically set in HTTP-only cookies.

### 2. Access Protected Routes
\`\`\`bash
curl http://localhost:5000/api/auth/profile \
  -H "Cookie: accessToken=YOUR_TOKEN"
\`\`\`

### 3. Socket.IO Connection
\`\`\`javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_ACCESS_TOKEN' }
});
\`\`\`

## Permission Levels

1. **PUBLIC** - Anyone can access
2. **GUEST** - Guest token or higher
3. **USER** - Authenticated users
4. **ADMIN** - Admin users only

## Technologies

- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Express** - Web framework
- **Socket.IO** - WebSocket communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## API Documentation

Access Swagger documentation at:
\`\`\`
http://localhost:5000/api-docs
\`\`\`

## Development

\`\`\`bash
# Run development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Environment Variables

See `.env.example` for all available configuration options.

## Security Features

- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ Role-based access control

## License

MIT
