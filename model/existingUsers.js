const mongoose = require("mongoose");

const ExistingUsers = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("existingUsers_tb", ExistingUsers);
