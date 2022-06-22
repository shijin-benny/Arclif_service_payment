const mongoose = require("mongoose");

const maildetailsSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sendMails_tb", maildetailsSchema);
