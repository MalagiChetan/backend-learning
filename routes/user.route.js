const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
} = require("../controller/user.controller");

// Define your user routes here
router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.post("/create", createUser);

module.exports = router;
