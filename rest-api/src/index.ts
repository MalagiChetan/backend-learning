import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5175;
const FILES_DIR = path.join(__dirname, "./files");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure files directory exists
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

// ============ REST API Endpoints ============
/**
 * GET /api/files
 * Returns all files in the files directory
 */
app.get("/api/files", (req: Request, res: Response) => {
  fs.readdir(FILES_DIR, (err: NodeJS.ErrnoException | null, files: string[]) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to read files", details: err.message });
    }
    res.json({
      success: true,
      count: files.length,
      files: files,
    });
  });
});

/**
 * GET /api/files/:fileName
 * Returns the content of a specific file
 */
app.get("/api/files/:fileName", (req: Request, res: Response) => {
  const fileName = req.params.fileName as string;
  const filePath = path.join(FILES_DIR, fileName);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(FILES_DIR)) {
    return res.status(400).json({ error: "Invalid file name" });
  }

  fs.readFile(
    filePath,
    "utf-8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        if (err.code === "ENOENT") {
          return res.status(404).json({ error: "File not found" });
        }
        return res
          .status(500)
          .json({ error: "Failed to read file", details: err.message });
      }
      res.json({
        success: true,
        fileName: fileName,
        content: data,
      });
    }
  );
});

/**
 * POST /api/files
 * Creates a new file with title and description
 */
app.post("/api/files", (req: Request, res: Response) => {
  const { title, description } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
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
        return res
          .status(500)
          .json({ error: "Failed to create file", details: err.message });
      }
      res.status(201).json({
        success: true,
        message: "File created successfully",
        fileName: titleFileName,
        title: title,
        description: description,
      });
    }
  );
});

/**
 * PUT /api/files/:fileName
 * Updates an existing file
 */
app.put("/api/files/:fileName", (req: Request, res: Response) => {
  const fileName = req.params.fileName as string;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  const filePath = path.join(FILES_DIR, fileName);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(FILES_DIR)) {
    return res.status(400).json({ error: "Invalid file name" });
  }

  fs.writeFile(
    filePath,
    description,
    "utf-8",
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to update file", details: err.message });
      }
      res.json({
        success: true,
        message: "File updated successfully",
        fileName: fileName,
        description: description,
      });
    }
  );
});

/**
 * DELETE /api/files/:fileName
 * Deletes a file
 */
app.delete("/api/files/:fileName", (req: Request, res: Response) => {
  const fileName = req.params.fileName as string;
  const filePath = path.join(FILES_DIR, fileName);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(FILES_DIR)) {
    return res.status(400).json({ error: "Invalid file name" });
  }

  fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "File not found" });
      }
      return res
        .status(500)
        .json({ error: "Failed to delete file", details: err.message });
    }
    res.json({
      success: true,
      message: "File deleted successfully",
      fileName: fileName,
    });
  });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "REST API Server is running" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`REST API Server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /api/files              - Get all files`);
  console.log(`  GET    /api/files/:fileName    - Get file content`);
  console.log(`  POST   /api/files              - Create new file`);
  console.log(`  PUT    /api/files/:fileName    - Update file`);
  console.log(`  DELETE /api/files/:fileName    - Delete file`);
});
