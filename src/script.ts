import express, { Request, Response } from "express";
// import path from "path";
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  // i want to read all files in the "./files" directory and pass their contents to the template
  fs.readdir(
    path.join(__dirname, "./files"),
    (err: NodeJS.ErrnoException | null, files: string[]) => {
      res.render("index", { files: files });
    }
  );
});

app.get("/read/:fileName", (req: Request, res: Response) => {
  const { fileName } = req.params;
  fs.readFile(
    path.join(__dirname, "./files", fileName),
    "utf-8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        console.error(err);
        res.status(500).send("An error occurred while reading the file.");
        return;
      }
      res.render("read", { fileName: fileName, data: data });
    }
  );
});

app.post("/", (req: Request, res: Response) => {
  const { title, description } = req.body;
  const titleFileName = `${title
    .split(" ")
    .map((val: string, idx: number) => {
      if (idx === 0) {
        return val.charAt(0).toLowerCase() + val.slice(1);
      }
      return val.charAt(0).toUpperCase() + val.slice(1);
    })
    .join("")}.txt`;
  fs.writeFile(
    path.join(__dirname, "./files", titleFileName),
    `${description}`,
    "utf-8",
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error(err);
        res.status(500).send("An error occurred while writing to the file.");
        return;
      }
      res.redirect("/");
    }
  );
});

app.listen(5174, () => {
  console.log("Server is running on http://localhost:5174");
});
