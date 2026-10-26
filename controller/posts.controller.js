const Post = require("../models/posts.model");

const getPostByPostId = async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllPostByUserId = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).populate("userId");
    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Define controller to add post by specific user
const addPostByUserId = async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    const newPost = new Post({ title, content, userId });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPostByPostId, addPostByUserId, getAllPostByUserId };
