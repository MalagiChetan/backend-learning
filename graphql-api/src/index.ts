import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { gql } from "graphql-tag";
import express from "express";
import path from "path";
import fs from "fs";

const PORT = 5176;
const FILES_DIR = path.join(__dirname, "./files");

// Ensure files directory exists
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

// ============ GraphQL Schema ============

const typeDefs = gql`
  type File {
    fileName: String!
    content: String!
  }

  type FileInfo {
    fileName: String!
  }

  type CreateFileResponse {
    success: Boolean!
    message: String!
    fileName: String!
    title: String!
    description: String!
  }

  type UpdateFileResponse {
    success: Boolean!
    message: String!
    fileName: String!
    content: String!
  }

  type DeleteFileResponse {
    success: Boolean!
    message: String!
    fileName: String!
  }

  type FileListResponse {
    success: Boolean!
    count: Int!
    files: [FileInfo!]!
  }

  type Query {
    """
    Get all files in the files directory
    """
    files: FileListResponse!

    """
    Get the content of a specific file
    """
    file(fileName: String!): File

    """
    Get health status of the server
    """
    health: String!
  }

  type Mutation {
    """
    Create a new file with title and description
    """
    createFile(title: String!, description: String!): CreateFileResponse!

    """
    Update an existing file with new content
    """
    updateFile(fileName: String!, description: String!): UpdateFileResponse!

    """
    Delete a file
    """
    deleteFile(fileName: String!): DeleteFileResponse!
  }
`;

// ============ Resolvers ============

const resolvers = {
  Query: {
    files: (): Promise<any> => {
      return new Promise((resolve, reject) => {
        fs.readdir(
          FILES_DIR,
          (err: NodeJS.ErrnoException | null, files: string[]) => {
            if (err) {
              reject(new Error("Failed to read files"));
            } else {
              resolve({
                success: true,
                count: files.length,
                files: files.map((f) => ({ fileName: f })),
              });
            }
          }
        );
      });
    },

    file: (_: any, { fileName }: { fileName: string }): Promise<any> => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(FILES_DIR, fileName);

        // Security check: prevent directory traversal
        if (!filePath.startsWith(FILES_DIR)) {
          reject(new Error("Invalid file name"));
          return;
        }

        fs.readFile(
          filePath,
          "utf-8",
          (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) {
              if (err.code === "ENOENT") {
                reject(new Error("File not found"));
              } else {
                reject(new Error("Failed to read file"));
              }
            } else {
              resolve({
                fileName: fileName,
                content: data,
              });
            }
          }
        );
      });
    },

    health: () => {
      return "GraphQL API Server is running";
    },
  },

  Mutation: {
    createFile: (
      _: any,
      { title, description }: { title: string; description: string }
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!title || !description) {
          reject(new Error("Title and description are required"));
          return;
        }

        const titleFileName = `${title
          .split(" ")
          .map((val: string, idx: number) => {
            if (idx === 0) {
              return val.charAt(0).toLowerCase() + val.slice(1);
            }
            return val.charAt(0).toUpperCase() + val.slice(1);
          })
          .join("")}.txt`;

        const filePath = path.join(FILES_DIR, titleFileName);

        fs.writeFile(
          filePath,
          description,
          "utf-8",
          (err: NodeJS.ErrnoException | null) => {
            if (err) {
              reject(new Error("Failed to create file"));
            } else {
              resolve({
                success: true,
                message: "File created successfully",
                fileName: titleFileName,
                title: title,
                description: description,
              });
            }
          }
        );
      });
    },

    updateFile: (
      _: any,
      { fileName, description }: { fileName: string; description: string }
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!description) {
          reject(new Error("Description is required"));
          return;
        }

        const filePath = path.join(FILES_DIR, fileName);

        // Security check: prevent directory traversal
        if (!filePath.startsWith(FILES_DIR)) {
          reject(new Error("Invalid file name"));
          return;
        }

        fs.writeFile(
          filePath,
          description,
          "utf-8",
          (err: NodeJS.ErrnoException | null) => {
            if (err) {
              reject(new Error("Failed to update file"));
            } else {
              resolve({
                success: true,
                message: "File updated successfully",
                fileName: fileName,
                content: description,
              });
            }
          }
        );
      });
    },

    deleteFile: (_: any, { fileName }: { fileName: string }): Promise<any> => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(FILES_DIR, fileName);

        // Security check: prevent directory traversal
        if (!filePath.startsWith(FILES_DIR)) {
          reject(new Error("Invalid file name"));
          return;
        }

        fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            if (err.code === "ENOENT") {
              reject(new Error("File not found"));
            } else {
              reject(new Error("Failed to delete file"));
            }
          } else {
            resolve({
              success: true,
              message: "File deleted successfully",
              fileName: fileName,
            });
          }
        });
      });
    },
  },
};

// ============ Apollo Server Setup ============

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(express.json());
  app.use("/graphql", expressMiddleware(server));

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "GraphQL API Server is running" });
  });

  // Welcome endpoint with documentation
  app.get("/", (req, res) => {
    res.send(`
      <html>
        <head>
          <title>File Manager GraphQL API</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .info { background: #f0f0f0; padding: 15px; border-radius: 5px; }
            code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>🚀 File Manager GraphQL API</h1>
          <div class="info">
            <p><strong>GraphiQL Explorer:</strong> <a href="http://localhost:${PORT}/graphql">${PORT}/graphql</a></p>
            <p><strong>Status:</strong> ✅ Server is running</p>
          </div>
          <h2>Quick Start</h2>
          <p>Visit <code>/graphql</code> to use the GraphiQL interface and explore the API.</p>
        </body>
      </html>
    `);
  });

  app.listen(PORT, () => {
    console.log(`\n🚀 GraphQL API Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphiQL Explorer: http://localhost:${PORT}/graphql`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
