const mongoose = require("mongoose");
const User = require("../models/user.model");

mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  // I need to delete last 40 users instead of all
const deleteUsers = async () => {
  const users = await User.find().sort({ _id: -1 }).limit(40);
  for (const user of users) {
    await User.findByIdAndDelete(user._id);
  }
  console.log("Last 40 users deleted successfully");
  mongoose.connection.close();
};

deleteUsers();
