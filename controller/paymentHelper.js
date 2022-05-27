const paymentSchema = require("../model/paymentSchema");
const razorpayPayment = require("../payment_Integration/razorpay");
const sendMail = require("../controller/Nodemailer/nodemailer");
const filedataupload = require("../model/fileupload");
const mongoose = require("mongoose");
const async = require("hbs/lib/async");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  //<!===== create payment order and inset userid,orderId to database =======/> //
  paymentOrder: async (req, res) => {
    try {
      if (req.body.paymentmode === "downpayment") {
        console.log(req.body);
        const downpayment = await paymentSchema.findOne({
          $and: [{ userId: req.body.userId }, { paymentmode: "downpayment" }],
        });
        if (downpayment) {
          if (
            downpayment.paymentStatus === "captured" ||
            downpayment.paymentStatus === "authorized"
          ) {
            res.json({ status: 200, message: "Payment already done" });
          } else {
            res.json({
              status: 200,
              order: {
                id: downpayment.orderId,
                amount: downpayment.amount,
                paymentmode: downpayment.paymentmode,
              },
            });
          }
        } else {
          razorpayPayment.createOrder(req.body.amount).then(async (order) => {
            if (order.status === "created") {
              const payment = new paymentSchema({
                orderId: order.id,
                amount: order.amount,
                userId: req.body.userId,
                paymentStatus: "created",
                paymentmode: req.body.paymentmode,
              });
              payment
                .save()
                .then((data) => {
                  res.json({
                    status: 200,
                    order: {
                      id: order.id,
                      amount: order.amount,
                      paymentmode: data.paymentmode,
                    },
                  });
                })
                .catch((err) => {
                  res.json({ status: 500, message: err });
                });
            }
          });
        }
      } else if (req.body.paymentmode === "stage") {
        console.log(req.body);
        const stage = await paymentSchema.findOne({
          $and: [
            { userId: req.body.userId },
            { planname: req.body.planname },
            { stage: req.body.stage },
          ],
        });
        if (stage) {
          if (
            stage.paymentStatus === "captured" ||
            stage.paymentStatus === "authorized"
          ) {
            res.json({ status: 200, message: "Payment already done" });
          } else {
            console.log(stage);
            res.json({
              status: 200,
              order: {
                id: stage.orderId,
                amount: stage.amount,
                stage: stage.stage,
              },
            });
          }
        } else {
          razorpayPayment.createOrder(req.body.amount).then(async (order) => {
            if (order.status === "created") {
              const payment = new paymentSchema({
                orderId: order.id,
                amount: order.amount,
                userId: req.body.userId,
                paymentStatus: "created",
                stage: req.body.stage,
                planname: req.body.planname,
                paymentmode: req.body.paymentmode,
              });
              payment
                .save()
                .then((data) => {
                  console.log(data);
                  res.json({
                    status: 200,
                    order: {
                      id: order.id,
                      amount: order.amount,
                      stage: data.stage,
                      paymentmode: data.paymentmode,
                    },
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({ status: 500, message: err });
                });
            } else {
              res.json({ status: 500, message: "something went wrong" });
            }
          });
        }
      } else if (req.body.paymentmode === "finalpayment") {
        console.log(req.body);
        const finalpayment = await paymentSchema.findOne({
          $and: [
            { userId: req.body.userId },
            { paymentmode: req.body.paymentmode },
          ],
        });
        if (finalpayment) {
          if (
            finalpayment.paymentStatus === "captured" ||
            finalpayment.paymentStatus === "authorized"
          ) {
            res.json({ status: 200, message: "Payment already done" });
          } else {
            res.json({
              status: 200,
              order: {
                id: finalpayment.orderId,
                amount: finalpayment.amount,
                paymentmode: finalpayment.paymentmode,
              },
            });
          }
        } else {
          razorpayPayment.createOrder(req.body.amount).then(async (order) => {
            console.log(order);
            if (order.status === "created") {
              const payment = new paymentSchema({
                orderId: order.id,
                amount: order.amount,
                userId: req.body.userId,
                paymentStatus: "created",
                paymentmode: req.body.paymentmode,
              });
              payment
                .save()
                .then((data) => {
                  res.json({
                    status: 200,
                    order: {
                      id: order.id,
                      amount: order.amount,
                      paymentmode: data.paymentmode,
                    },
                  });
                })
                .catch((err) => {
                  res.json({ status: 500, message: err });
                });
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ error: error });
    }
  },
  //<!========= verify payment and update payment status to database ========/>//
  paymentVerify: (req, res) => {
    razorpayPayment
      .verifyPayment(req.body)
      .then((order) => {
        console.log(order);
        paymentSchema.updateOne(
          { orderId: order.order_id },
          {
            $set: {
              paymentId: order.id,
              amount: order.amount / 100,
              paymentStatus: order.status,
              method: order.method,
              email: order.email,
              bank: order.bank,
              contact: order.contact,
              acquirer_data: order.acquirer_data,
            },
          },
          (err, data) => {
            console.log(data);
            if (err) {
              res.json({ error: err, message: "Payment updation failed" });
            } else {
              sendMail
                .receiptMail(order)
                .then((mail) => {
                  res.redirect("https://agriha.arclif.com/success");
                })
                .catch((err) => {
                  res.json({
                    error: err,
                    message:
                      "Payment verified successfully but mail sending failed",
                  });
                });
            }
          }
        );
      })
      .catch((err) => {
        res.json({ status: 500, message: "Payment not verified" });
      });
  },
};
