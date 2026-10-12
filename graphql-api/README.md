# File Manager - GraphQL API

A modern GraphQL implementation for file management operations with built-in GraphiQL explorer.

## Features

- ✅ List all files
- ✅ Read file content
- ✅ Create new files
- ✅ Update file content
- ✅ Delete files
- ✅ GraphiQL Web UI for interactive queries
- ✅ Type-safe GraphQL schema
- ✅ Full error handling

## Setup

```bash
npm install
```

## Running

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

## Accessing GraphiQL

Once the server is running, open your browser and go to:

```
http://localhost:5176/graphql
```

You'll see the GraphiQL interface where you can:

- Write queries and mutations
- See real-time documentation
- Auto-complete with Ctrl+Space
- Format queries with Ctrl+Shift+P

## GraphQL Queries & Mutations

### Query: Get All Files

```graphql
query {
  files {
    success
    count
    files {
      fileName
    }
  }
}
```

### Query: Get File Content

```graphql
query {
  file(fileName: "myFile.txt") {
    fileName
    content
  }
}
```

### Mutation: Create File

```graphql
mutation {
  createFile(title: "My Task", description: "This is my task description") {
    success
    message
    fileName
    title
    description
  }
}
```

### Mutation: Update File

```graphql
mutation {
  updateFile(fileName: "myTask.txt", description: "Updated description") {
    success
    message
    fileName
    content
  }
}
```

### Mutation: Delete File

```graphql
mutation {
  deleteFile(fileName: "myTask.txt") {
    success
    message
    fileName
  }
}
```

### Query: Health Check

```graphql
query {
  health
}
```

## API Information

- **Base URL:** `http://localhost:5176`
- **GraphQL Endpoint:** `http://localhost:5176/graphql`
- **Health Check:** `http://localhost:5176/health`

## Schema Overview

```graphql
type Query {
  files: FileListResponse!
  file(fileName: String!): File
  health: String!
}

type Mutation {
  createFile(title: String!, description: String!): CreateFileResponse!
  updateFile(fileName: String!, description: String!): UpdateFileResponse!
  deleteFile(fileName: String!): DeleteFileResponse!
}

type File {
  fileName: String!
  content: String!
}

type FileListResponse {
  success: Boolean!
  count: Int!
  files: [FileInfo!]!
}
```

## Benefits of GraphQL

- 📝 **Single Query Language**: One endpoint for all operations
- 🎯 **Request Only What You Need**: Avoid over-fetching data
- 📚 **Self-Documenting**: Built-in schema exploration
- 🛠️ **Developer Experience**: GraphiQL for interactive testing
- 🔒 **Type Safety**: Strongly typed schema
- 📊 **Real-time Documentation**: Hover over fields to see descriptions

## Port

Server runs on port **5176**
