const paymentSchema = require("../model/paymentSchema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  cartview: async (req, res) => {
    try {
      const payments = await paymentSchema.find({
        $and: [{ userId: req.params.id }, { paymentmode: "stage" }],
      });
      if (payments.length > 0) {
        res.json({ status: 200, payments: payments });
      } else {
        res.json({ status: 404, message: "No payments found" });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
