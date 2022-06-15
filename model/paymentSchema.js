const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    userId: {
      type: ObjectId,
    },
    paymentStatus: {
      type: String,
    },
    method: {
      type: String,
    },
    userName: {
      type: String,
    },
    bank: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
    },
    stage: {
      type: String,
    },
    acquirer_data: [],
    paymentmode: {
      type: String,
    },
    planname: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
