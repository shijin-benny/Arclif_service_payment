const mongoose = require("mongoose");

const SendEmails = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    status: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sendmailDetails_tb", SendEmails);
