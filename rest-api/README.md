# File Manager - REST API

A clean REST API implementation for file management operations.

## Features

- ✅ List all files
- ✅ Read file content
- ✅ Create new files
- ✅ Update file content
- ✅ Delete files
- ✅ Error handling with proper HTTP status codes

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

## API Endpoints

### Get All Files

```
GET /api/files
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "files": ["file1.txt", "file2.txt"]
}
```

### Get File Content

```
GET /api/files/:fileName
```

**Response:**

```json
{
  "success": true,
  "fileName": "file1.txt",
  "content": "File content here..."
}
```

### Create File

```
POST /api/files
Content-Type: application/json

{
  "title": "My File",
  "description": "This is the file content"
}
```

**Response:**

```json
{
  "success": true,
  "message": "File created successfully",
  "fileName": "myFile.txt",
  "title": "My File",
  "description": "This is the file content"
}
```

### Update File

```
PUT /api/files/:fileName
Content-Type: application/json

{
  "description": "Updated content"
}
```

**Response:**

```json
{
  "success": true,
  "message": "File updated successfully",
  "fileName": "myFile.txt",
  "description": "Updated content"
}
```

### Delete File

```
DELETE /api/files/:fileName
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully",
  "fileName": "myFile.txt"
}
```

## Testing with cURL

```bash
# Get all files
curl http://localhost:5175/api/files

# Create a file
curl -X POST http://localhost:5175/api/files \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Do something"}'

# Get file content
curl http://localhost:5175/api/files/myTask.txt

# Update file
curl -X PUT http://localhost:5175/api/files/myTask.txt \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated task"}'

# Delete file
curl -X DELETE http://localhost:5175/api/files/myTask.txt
```

## Port

Server runs on port **5175**
