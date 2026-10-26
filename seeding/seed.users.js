// seed the 50 users into the database
const mongoose = require("mongoose");
const User = require("../models/user.model");

// use faker
const { faker } = require("@faker-js/faker");

mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedUsers = async () => {
  for (let i = 1; i <= 50; i++) {
    const user = new User({
      name: `${faker.internet.username()}`,
      email: `${faker.internet.email()}`,
      password: `${faker.internet.password()}`,
    });
    await user.save();
  }
  console.log("50 users seeded successfully");
  mongoose.connection.close();
};

seedUsers();
