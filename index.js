const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/posts.route");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  // Integrate self defined routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.listen(5174, () => {
  console.log("Server is running on port 5174");
}); 
