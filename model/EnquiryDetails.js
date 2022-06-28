const mongoose = require("mongoose");

const EnquiryDetails = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("enquiryDetails_tb", EnquiryDetails);
