# 🚀 Complete Setup & Deployment Guide

This guide walks through setting up, running, and deploying all three file manager implementations.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Running Locally](#running-locally)
3. [Testing](#testing)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A code editor (VS Code recommended)

### Step 1: Verify Installation

```bash
node --version  # Should be v18+
npm --version   # Should be 9+
```

### Step 2: Clone/Download Project

```bash
# Navigate to your projects folder
cd /path/to/projects
git clone <your-repo-url> backend-learning
cd backend-learning
```

---

## Running Locally

### Option 1: Run Individually

**Terminal 1 - Original Server (Port 5174)**

```bash
# From root directory
npm install
npm run dev

# Access: http://localhost:5174
```

**Terminal 2 - REST API Server (Port 5175)**

```bash
# From root directory in a new terminal
cd rest-api
npm install
npm run dev

# Access: http://localhost:5175/api/files
```

**Terminal 3 - GraphQL API Server (Port 5176)**

```bash
# From root directory in a new terminal
cd graphql-api
npm install
npm run dev

# Access: http://localhost:5176/graphql
```

### Option 2: Create a Root package.json Script (Advanced)

Create scripts in the root `package.json` to run all servers:

```bash
npm install --workspaces
npm run dev --workspaces
```

---

## Testing

### Manual Testing via Browser

1. **Original Server**

   ```
   http://localhost:5174
   ```

   - Fill form and click Submit
   - Click "Read More" to view file contents

2. **GraphQL API**

   ```
   http://localhost:5176/graphql
   ```

   - Copy-paste example queries from API_REFERENCE.md
   - Use Ctrl+Space for autocomplete
   - Click play button to execute

3. **REST API via Postman/REST Client**
   - Use Postman or VS Code REST Client extension
   - Import the cURL examples from API_REFERENCE.md

### Automated Testing with cURL

```bash
# Test all servers are running
curl http://localhost:5174 -o /dev/null -s -w "%{http_code}\n"
curl http://localhost:5175/health -o /dev/null -s -w "%{http_code}\n"
curl http://localhost:5176/health -o /dev/null -s -w "%{http_code}\n"

# Expected output: 200 for all three
```

### Testing Workflow

1. **Create a file:**

   ```bash
   curl -X POST http://localhost:5175/api/files \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Task","description":"Testing"}'
   ```

2. **Read the file:**

   ```bash
   curl http://localhost:5175/api/files/testTask.txt
   ```

3. **Update the file:**

   ```bash
   curl -X PUT http://localhost:5175/api/files/testTask.txt \
     -H "Content-Type: application/json" \
     -d '{"description":"Updated test"}'
   ```

4. **Delete the file:**
   ```bash
   curl -X DELETE http://localhost:5175/api/files/testTask.txt
   ```

---

## Deployment

### Deploy to Heroku

#### Step 1: Create Heroku Account

Visit https://www.heroku.com and create a free account.

#### Step 2: Install Heroku CLI

```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Verify
heroku --version
```

#### Step 3: Login to Heroku

```bash
heroku login
```

#### Step 4: Create Procfile (for each project)

**rest-api/Procfile:**

```
web: npm start
```

**graphql-api/Procfile:**

```
web: npm start
```

#### Step 5: Deploy

```bash
# For REST API
cd rest-api
heroku create your-rest-api-name
git push heroku main

# For GraphQL API
cd ../graphql-api
heroku create your-graphql-api-name
git push heroku main
```

### Deploy to Vercel (Next.js or Serverless Functions)

Requires refactoring to serverless functions. See advanced setup.

### Deploy with Docker

#### Step 1: Create Dockerfile (for each project)

**rest-api/Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5175
CMD ["npm", "start"]
```

#### Step 2: Build and Run

```bash
cd rest-api
docker build -t file-manager-rest .
docker run -p 5175:5175 file-manager-rest
```

### Deploy to DigitalOcean/AWS/Azure

1. Create a droplet/EC2 instance
2. SSH into the instance
3. Clone repository
4. Install Node.js
5. Install PM2 for process management:
   ```bash
   npm install -g pm2
   ```
6. Start servers with PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

#### Example ecosystem.config.js:

```javascript
module.exports = {
  apps: [
    {
      name: "original-ssr",
      script: "./src/script.ts",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: { PORT: 5174 },
    },
    {
      name: "rest-api",
      script: "./src/index.ts",
      cwd: "./rest-api",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: { PORT: 5175 },
    },
    {
      name: "graphql-api",
      script: "./src/index.ts",
      cwd: "./graphql-api",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: { PORT: 5176 },
    },
  ],
};
```

---

## Troubleshooting

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5175`

**Solution:**

```bash
# Windows - Find process using port 5175
netstat -ano | findstr :5175

# Windows - Kill process
taskkill /PID <PID> /F

# macOS/Linux - Find and kill
lsof -i :5175
kill -9 <PID>
```

### Issue: Dependencies Not Installed

**Error:** `Cannot find module 'express'`

**Solution:**

```bash
# Remove node_modules
rm -r node_modules package-lock.json

# Reinstall
npm install

# If still failing, clear npm cache
npm cache clean --force
npm install
```

### Issue: TypeScript Compilation Error

**Error:** `TS2307: Cannot find module`

**Solution:**

```bash
# Make sure @types packages are installed
npm install --save-dev @types/node @types/express

# Recompile
npm run build
```

### Issue: GraphQL Server Won't Start

**Error:** `Cannot find module 'apollo-server-express'`

**Solution:**

```bash
cd graphql-api
npm install
npm run dev
```

### Issue: Files Not Being Saved

**Check:**

1. Does `./files` directory exist?

   ```bash
   ls -la  # or dir on Windows
   ```

2. Directory permissions:

   ```bash
   # macOS/Linux
   chmod 755 files
   ```

3. File system space:
   ```bash
   df -h  # or disk space in Windows
   ```

### Issue: TypeScript Watch Not Detecting Changes

**Solution:**

```bash
# Clear tsx cache and restart
rm -r node_modules/.cache
npm run dev
```

---

## Environment Variables

Create a `.env` file in each project (optional):

```env
PORT=5175
NODE_ENV=development
LOG_LEVEL=debug
```

Then use in code:

```typescript
const PORT = process.env.PORT || 5175;
```

---

## Performance Optimization

### For Production

1. **Build for production:**

   ```bash
   npm run build
   npm start
   ```

2. **Enable compression:**

   ```typescript
   import compression from "compression";
   app.use(compression());
   ```

3. **Add caching headers:**

   ```typescript
   app.use(
     express.static("public", {
       maxAge: "1d",
     })
   );
   ```

4. **Use PM2 clustering:**
   ```bash
   pm2 start app.js -i max  # Uses all CPU cores
   ```

---

## Monitoring & Logging

### Add logging to track issues

```bash
npm install winston
```

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

---

## Security Best Practices

1. **Input Validation:**

   ```typescript
   if (!title || title.length > 100) {
     return res.status(400).json({ error: "Invalid input" });
   }
   ```

2. **Prevent Path Traversal:**

   ```typescript
   if (!filePath.startsWith(FILES_DIR)) {
     return res.status(400).json({ error: "Invalid file name" });
   }
   ```

3. **CORS Configuration:**

   ```typescript
   import cors from "cors";
   app.use(
     cors({
       origin: "https://yourdomain.com",
       credentials: true,
     })
   );
   ```

4. **Rate Limiting:**

   ```bash
   npm install express-rate-limit
   ```

5. **Helmet for Headers:**
   ```bash
   npm install helmet
   ```

---

## Next Steps

1. ✅ Set up all three servers
2. ✅ Test locally
3. ✅ Deploy one version (e.g., REST API)
4. ✅ Monitor logs
5. ✅ Add database persistence
6. ✅ Implement authentication
7. ✅ Add API documentation (Swagger/OpenAPI)

---

**Happy deploying! 🚀**
