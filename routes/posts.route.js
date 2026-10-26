const express = require("express");
const router = express.Router();

const {
  getPostByPostId,
  addPostByUserId,
  getAllPostByUserId,
} = require("../controller/posts.controller");

// Define your post routes here

router.get("/:id", getPostByPostId);

router.get("/users/:userId", getAllPostByUserId);

router.post("/create", addPostByUserId);

module.exports = router;
