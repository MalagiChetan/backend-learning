# API Quick Reference Guide

## 🚀 Quick Start All Three Servers

| Server             | Port | Command                         | URL                             |
| ------------------ | ---- | ------------------------------- | ------------------------------- |
| **Original (SSR)** | 5174 | `npm run dev`                   | http://localhost:5174           |
| **REST API**       | 5175 | `cd rest-api && npm run dev`    | http://localhost:5175/api/files |
| **GraphQL API**    | 5176 | `cd graphql-api && npm run dev` | http://localhost:5176/graphql   |

---

## 📡 REST API Examples

### 1. Get All Files

```bash
curl http://localhost:5175/api/files
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "files": ["task1.txt", "task2.txt"]
}
```

### 2. Create a File

```bash
curl -X POST http://localhost:5175/api/files \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy Groceries",
    "description": "Milk, Eggs, Bread, Cheese"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "File created successfully",
  "fileName": "buyGroceries.txt",
  "title": "Buy Groceries",
  "description": "Milk, Eggs, Bread, Cheese"
}
```

### 3. Read a File

```bash
curl http://localhost:5175/api/files/buyGroceries.txt
```

**Response:**

```json
{
  "success": true,
  "fileName": "buyGroceries.txt",
  "content": "Milk, Eggs, Bread, Cheese"
}
```

### 4. Update a File

```bash
curl -X PUT http://localhost:5175/api/files/buyGroceries.txt \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Milk, Eggs, Bread, Cheese, Butter"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "File updated successfully",
  "fileName": "buyGroceries.txt",
  "description": "Milk, Eggs, Bread, Cheese, Butter"
}
```

### 5. Delete a File

```bash
curl -X DELETE http://localhost:5175/api/files/buyGroceries.txt
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully",
  "fileName": "buyGroceries.txt"
}
```

---

## 🚀 GraphQL API Examples

### Using cURL

#### 1. Get All Files

```bash
curl -X POST http://localhost:5176/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { files { success count files { fileName } } }"
  }'
```

#### 2. Create a File

```bash
curl -X POST http://localhost:5176/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createFile(title: \"Learn GraphQL\", description: \"GraphQL is amazing\") { success fileName } }"
  }'
```

#### 3. Read a File

```bash
curl -X POST http://localhost:5176/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { file(fileName: \"learnGraphQL.txt\") { fileName content } }"
  }'
```

#### 4. Update a File

```bash
curl -X POST http://localhost:5176/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { updateFile(fileName: \"learnGraphQL.txt\", description: \"GraphQL is awesome!\") { success message } }"
  }'
```

#### 5. Delete a File

```bash
curl -X POST http://localhost:5176/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { deleteFile(fileName: \"learnGraphQL.txt\") { success message } }"
  }'
```

### Using GraphiQL UI (Recommended)

1. Open http://localhost:5176/graphql
2. Enter queries in the left panel:

```graphql
# Get all files
query {
  files {
    success
    count
    files {
      fileName
    }
  }
}

# Create file
mutation {
  createFile(title: "My Task", description: "Description here") {
    success
    message
    fileName
  }
}

# Get file content
query {
  file(fileName: "myTask.txt") {
    fileName
    content
  }
}

# Update file
mutation {
  updateFile(fileName: "myTask.txt", description: "Updated") {
    success
    message
    content
  }
}

# Delete file
mutation {
  deleteFile(fileName: "myTask.txt") {
    success
    message
  }
}

# Health check
query {
  health
}
```

---

## 🔄 JavaScript Fetch Examples

### REST API

```javascript
// Get all files
fetch("http://localhost:5175/api/files")
  .then((r) => r.json())
  .then((data) => console.log(data));

// Create file
fetch("http://localhost:5175/api/files", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "My Task",
    description: "Task description",
  }),
})
  .then((r) => r.json())
  .then((data) => console.log(data));

// Get file
fetch("http://localhost:5175/api/files/myTask.txt")
  .then((r) => r.json())
  .then((data) => console.log(data));

// Update file
fetch("http://localhost:5175/api/files/myTask.txt", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ description: "Updated" }),
})
  .then((r) => r.json())
  .then((data) => console.log(data));

// Delete file
fetch("http://localhost:5175/api/files/myTask.txt", {
  method: "DELETE",
})
  .then((r) => r.json())
  .then((data) => console.log(data));
```

### GraphQL API

```javascript
// Generic function
function queryGraphQL(query) {
  return fetch("http://localhost:5176/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((r) => r.json());
}

// Get all files
queryGraphQL(`
  query {
    files {
      count
      files { fileName }
    }
  }
`).then((data) => console.log(data));

// Create file
queryGraphQL(`
  mutation {
    createFile(title: "Task", description: "Description") {
      success
      fileName
    }
  }
`).then((data) => console.log(data));

// Get file
queryGraphQL(`
  query {
    file(fileName: "task.txt") {
      content
    }
  }
`).then((data) => console.log(data));

// Update file
queryGraphQL(`
  mutation {
    updateFile(fileName: "task.txt", description: "Updated") {
      success
    }
  }
`).then((data) => console.log(data));

// Delete file
queryGraphQL(`
  mutation {
    deleteFile(fileName: "task.txt") {
      success
    }
  }
`).then((data) => console.log(data));
```

---

## 🔍 HTTP Status Codes (REST API)

| Code | Meaning      | Example                     |
| ---- | ------------ | --------------------------- |
| 200  | OK           | File retrieved successfully |
| 201  | Created      | File created successfully   |
| 400  | Bad Request  | Missing required parameters |
| 404  | Not Found    | File doesn't exist          |
| 500  | Server Error | File operation failed       |

---

## 📊 Architecture Comparison

### Original (EJS + Express)

```
User Browser
    ↓
  Form Submit
    ↓
Express Server
    ↓
Read/Write Files
    ↓
Render EJS Template
    ↓
Return HTML
```

### REST API

```
Client (Mobile/Web)
    ↓
HTTP Request (GET/POST/PUT/DELETE)
    ↓
Express Server
    ↓
Read/Write Files
    ↓
Return JSON
    ↓
Client parses JSON
```

### GraphQL API

```
Client (Mobile/Web)
    ↓
GraphQL Query/Mutation
    ↓
Apollo Server
    ↓
Resolve Fields
    ↓
Read/Write Files
    ↓
Return JSON (exact shape requested)
    ↓
Client uses data
```

---

## 🎯 Use Case Recommendations

### Use Original (SSR) when:

- Building traditional web applications
- Server-side rendering is beneficial
- Simple CRUD operations needed
- SEO is important

### Use REST API when:

- Building mobile apps
- Multiple frontend clients needed
- Microservices architecture
- Standard API requirements
- Simple data structures

### Use GraphQL when:

- Complex, nested data queries
- Multiple clients with different data needs
- Real-time subscriptions needed (future)
- Rapid frontend development
- Need API playground (GraphiQL)

---

## 🧪 Testing Commands

```bash
# Test Original Server
curl http://localhost:5174

# Test REST API Health
curl http://localhost:5175/health

# Test GraphQL Health
curl http://localhost:5176/health

# List REST endpoints
curl http://localhost:5175/api/files

# Open GraphiQL
# http://localhost:5176/graphql (in browser)
```

---

## 📚 Additional Resources

- REST API: [REST Constraints](https://en.wikipedia.org/wiki/Representational_state_transfer)
- GraphQL: [GraphQL Official Docs](https://graphql.org/)
- Apollo: [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- Express: [Express.js Documentation](https://expressjs.com/)

---

**Last Updated:** 2024
