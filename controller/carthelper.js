const userplan_tbs = require("../model/userplan_tbs");
const paymentSchema = require()
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  // cartview: (req, res) => {
  //   userplan_tbs
  //     .aggregate([
  //       {
  //         $match: {
  //           login_id: ObjectId(req.params.id),
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "paymentplan_tbs",
  //           localField: "paymentplan_id",
  //           foreignField: "_id",
  //           as: "paymentplan",
  //         },
  //       },
  //       {
  //         $unwind: "$paymentplan",
  //       },
  //       {
  //         $lookup: {
  //           from: "payments",
  //           localField: "login_id",
  //           foreignField: "userId",
  //           as: "payments",
  //         },
  //       },
  //       {
  //         $unwind: "$payments",
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           paymentplan_id: 1,
  //           login_id: 1,
  //           plan_name: "$paymentplan.plan_name",
  //           plan_amount: "$paymentplan.plan_amount",
  //           initial_payment: "$paymentplan.initial_payment",
  //           payment_amount: "$payments.amount",
  //           payment_status: "$payments.paymentStatus",
  //         },
  //       },
  //     ])
  //     .then((result) => {
  //       console.log(result);
  //       const cartItems = result.map((items) => {
  //         return {
  //           _id: items._id,
  //           paymentplan_id: items.paymentplan_id,
  //           login_id: items.login_id,
  //           plan_name: items.plan_name,
  //           plan_amount: items.plan_amount,
  //           initial_payment: items.initial_payment,
  //           grant_total: items.payment_amount - items.initial_payment,
  //         };
  //       });
  //       res.json(cartItems);
  //     })
  //     .catch((err) => {
  //       res.json(err);
  //     });
  // },
  cartview: (req, res) => {
    try {
      const payments = await paymentSchema.find({userId: ObjectId(req.params.id)});
      res.json(payments);
    } catch (error) {
      console.log(error);
    }
  }
};
