# File Manager - Complete Project Suite

This repository contains **three different implementations** of a file management application, showcasing different architectural approaches and API technologies.

## 📦 Project Structure

```
backend-learning/
├── original/                 # Original EJS + Express Server-Side Rendering
├── rest-api/                 # REST API Implementation
├── graphql-api/              # GraphQL API Implementation
├── README.md                 # This file
└── package.json              # Root package (optional for convenience)
```

---

## 🎯 Overview of Implementations

### 1. **Original Project** (Server-Side Rendering)

The original implementation using **Express with EJS templates**.

- **Port:** 5174
- **Approach:** Traditional server-side rendering
- **UI:** EJS templates with Tailwind CSS
- **Best for:** Traditional monolithic web applications

**Features:**

- Server-side file rendering
- HTML forms for creating files
- Traditional request/response cycle

**Getting Started:**

```bash
npm install
npm run dev
```

Open: `http://localhost:5174`

---

### 2. **REST API** 📡

A clean, standards-based REST API implementation.

- **Port:** 5175
- **Approach:** RESTful API with proper HTTP methods
- **Response Format:** JSON
- **Best for:** Mobile apps, SPAs, microservices

**Key Endpoints:**

```
GET    /api/files              # Get all files
GET    /api/files/:fileName    # Get file content
POST   /api/files              # Create new file
PUT    /api/files/:fileName    # Update file
DELETE /api/files/:fileName    # Delete file
```

**Getting Started:**

```bash
cd rest-api
npm install
npm run dev
```

**Example cURL:**

```bash
# Create file
curl -X POST http://localhost:5175/api/files \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Do something"}'

# Get all files
curl http://localhost:5175/api/files

# Delete file
curl -X DELETE http://localhost:5175/api/files/myTask.txt
```

---

### 3. **GraphQL API** 🚀

A modern GraphQL API with interactive GraphiQL explorer.

- **Port:** 5176
- **Approach:** GraphQL with Apollo Server
- **GraphiQL UI:** Yes, interactive query builder
- **Best for:** Complex data requirements, modern frontend frameworks

**Key Operations:**

```graphql
# Queries
query {
  files {
    count
    files {
      fileName
    }
  }
}
query {
  file(fileName: "file.txt") {
    fileName
    content
  }
}

# Mutations
mutation {
  createFile(title: "Task", description: "...") {
    success
  }
}
mutation {
  updateFile(fileName: "task.txt", description: "...") {
    success
  }
}
mutation {
  deleteFile(fileName: "task.txt") {
    success
  }
}
```

**Getting Started:**

```bash
cd graphql-api
npm install
npm run dev
```

**Access GraphiQL:** `http://localhost:5176/graphql`

---

## 📊 Comparison Table

| Feature              | Original              | REST API      | GraphQL API    |
| -------------------- | --------------------- | ------------- | -------------- |
| **Port**             | 5174                  | 5175          | 5176           |
| **Type**             | Server-Side Rendering | REST          | GraphQL        |
| **UI Framework**     | EJS + Tailwind        | JSON API      | GraphiQL       |
| **Best For**         | Web Applications      | Microservices | Modern Apps    |
| **Learning Curve**   | Easy                  | Medium        | Medium-Hard    |
| **Flexibility**      | Low                   | Medium        | High           |
| **Over-fetching**    | N/A                   | Possible      | No             |
| **Interactive Docs** | No                    | No            | Yes (GraphiQL) |
| **Scalability**      | Medium                | High          | Very High      |

---

## 🚀 Running All Three Simultaneously

You can run all three servers at the same time (they use different ports).

**Terminal 1 - Original:**

```bash
npm install
npm run dev
```

**Terminal 2 - REST API:**

```bash
cd rest-api
npm install
npm run dev
```

**Terminal 3 - GraphQL API:**

```bash
cd graphql-api
npm install
npm run dev
```

Then access:

- Original: http://localhost:5174
- REST API: http://localhost:5175
- GraphQL: http://localhost:5176/graphql

---

## 📚 Key Concepts Demonstrated

### Original (Traditional Approach)

- ✅ Server-side rendering with templates
- ✅ Form-based data submission
- ✅ Session management
- ✅ Direct file serving

### REST API (Stateless Approach)

- ✅ HTTP method semantics (GET, POST, PUT, DELETE)
- ✅ Proper status codes (200, 201, 404, 500)
- ✅ JSON request/response format
- ✅ URL-based resource identification
- ✅ Stateless client-server communication

### GraphQL API (Query Language Approach)

- ✅ Single endpoint for all operations
- ✅ Precise data selection
- ✅ Strongly typed schema
- ✅ Real-time API documentation
- ✅ Mutation operations for data modification
- ✅ Interactive GraphiQL IDE

---

## 🛠️ Technology Stack

**All Projects Use:**

- **Language:** TypeScript
- **Runtime:** Node.js
- **Dev Tools:** tsx, TypeScript compiler

**Original:**

- Express.js
- EJS templating
- Tailwind CSS

**REST API:**

- Express.js

**GraphQL API:**

- Apollo Server
- GraphQL
- Express.js

---

## 📋 API Testing

### Testing REST API

```bash
# Using cURL
curl http://localhost:5175/api/files

# Using Postman
# Import the REST endpoints and test collections

# Using fetch in JavaScript
fetch('http://localhost:5175/api/files')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Testing GraphQL API

```bash
# Using GraphiQL UI
Visit http://localhost:5176/graphql

# Using cURL with GraphQL query
curl -X POST http://localhost:5176/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { files { count } }"}'

# Using fetch in JavaScript
fetch('http://localhost:5176/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'query { files { count files { fileName } } }'
  })
}).then(r => r.json()).then(data => console.log(data))
```

---

## 🎓 Learning Outcomes

By exploring all three implementations, you'll understand:

1. **Server-Side Rendering**: Traditional web application architecture
2. **REST Architecture**: RESTful principles and HTTP semantics
3. **GraphQL**: Query language for APIs and data fetching
4. **API Design**: Choosing the right architecture for your needs
5. **TypeScript**: Type safety in Node.js applications
6. **Express.js**: Building web servers and APIs
7. **File Operations**: Working with Node.js file system APIs

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :5175

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Dependencies Not Installed

```bash
# Each project directory
npm install
```

### TypeScript Errors

```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

---

## 📝 Notes

- Each project has its own `package.json` and `tsconfig.json`
- Files are stored in a `./files` directory in each project
- All projects demonstrate the same file management functionality
- Each can be deployed independently
- Perfect for learning and portfolio demonstration

---

## 🚀 Next Steps

Consider adding:

- Database persistence (MongoDB, PostgreSQL)
- Authentication & Authorization
- Pagination for file lists
- File upload functionality
- Real-time updates (WebSockets)
- Testing (Jest, Vitest)
- Docker containerization
- Deployment configurations

---

## 📄 License

ISC

---

**Happy Learning! 🎉**
