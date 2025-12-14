# Socket.IO API Reference

## Connection

Connect to the Socket.IO server:
\`\`\`javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  auth: {
    token: 'your-jwt-token-here'
  }
});
\`\`\`

## Request/Response Pattern

### Request Format
\`\`\`json
{
  "type": "serviceName",
  "action": "actionName",
  "payload": {
    // your request data
  }
}
\`\`\`

### Response Format
\`\`\`json
{
  "status": true,
  "msg": "success_message",
  "data": {},
  "errors": [],
  "request": {}
}
\`\`\`

## Available Services & Actions

### 1. UG Course Service

**Type:** `ugCourseService`

#### List Courses
**Action:** `list`

**Payload:**
\`\`\`json
{
  "query": "search term",
  "page": 1,
  "limit": 10
}
\`\`\`

**Example:**
\`\`\`javascript
socket.emit('api-request', {
  type: 'ugCourseService',
  action: 'list',
  payload: {
    query: 'computer',
    page: 1,
    limit: 10
  }
});
\`\`\`

#### Create Course
**Action:** `create`

**Payload:**
\`\`\`json
{
  "course_name": "Computer Science",
  "description": "Bachelor of Computer Science",
  "duration": 4,
  "order_index": 1
}
\`\`\`

#### Update Course
**Action:** `update`

**Payload:**
\`\`\`json
{
  "id": "course_id",
  "course_name": "Updated Name",
  "description": "Updated description"
}
\`\`\`

#### Delete Course
**Action:** `delete`

**Payload:**
\`\`\`json
{
  "id": "course_id"
}
\`\`\`

---

### 2. User Service

**Type:** `userService`

#### List Users
**Action:** `list`

**Payload:**
\`\`\`json
{
  "query": "search term",
  "page": 1,
  "limit": 10
}
\`\`\`

#### Get User by ID
**Action:** `getById`

**Payload:**
\`\`\`json
{
  "id": "user_id"
}
\`\`\`

#### Update User
**Action:** `update`

**Payload:**
\`\`\`json
{
  "id": "user_id",
  "name": "Updated Name",
  "email": "updated@email.com"
}
\`\`\`

---

## Adding New Actions

To add new actions to existing services or create new services:

### Step 1: Create/Update Service File

\`\`\`typescript
// src/services/socket/your-service.service.ts
import type { SocketResponse } from "../../types/socket.types"
import { SocketResponseUtil } from "../../utils/socket-response.util"

export class YourService {
  static async yourAction(payload: any, request: any): Promise<SocketResponse> {
    try {
      // Your logic here
      return SocketResponseUtil.success("action_success", data, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "action_failed",
        [error instanceof Error ? error.message : "Unknown error"],
        request
      )
    }
  }
}
\`\`\`

### Step 2: Register in Service Registry

\`\`\`typescript
// src/sockets/service-registry.ts
import { YourService } from "../services/socket/your-service.service"

export const serviceRegistry: ServiceRegistry = {
  // ... existing services ...
  yourServiceName: {
    yourAction: YourService.yourAction,
    anotherAction: YourService.anotherAction,
  },
}
\`\`\`

### Step 3: Use in Client

\`\`\`javascript
socket.emit('api-request', {
  type: 'yourServiceName',
  action: 'yourAction',
  payload: {
    // your data
  }
});

socket.on('api-response', (response) => {
  if (response.status) {
    console.log('Success:', response.data);
  } else {
    console.error('Error:', response.errors);
  }
});
\`\`\`

## Event Names

- **Emit to server:** `api-request`
- **Listen from server:** `api-response`
- **Connection:** `connection` (server-side)
- **Disconnect:** `disconnect`

## Error Handling

Common error responses:
- `service_not_found` - Service type doesn't exist
- `action_not_found` - Action doesn't exist in service
- `validation_error` - Invalid payload data
- `internal_server_error` - Server error

## Testing with Socket.IO Client

\`\`\`javascript
// test-socket.js
const io = require('socket.io-client');

const socket = io('http://localhost:8000', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
  
  // Test request
  socket.emit('api-request', {
    type: 'ugCourseService',
    action: 'list',
    payload: {
      query: '',
      page: 1,
      limit: 10
    }
  });
});

socket.on('api-response', (response) => {
  console.log('Response:', JSON.stringify(response, null, 2));
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
