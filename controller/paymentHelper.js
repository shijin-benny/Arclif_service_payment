const paymentSchema = require("../model/paymentSchema");
const razorpayPayment = require("../payment_Integration/razorpay");
const sendMail = require("../controller/Nodemailer/nodemailer");
const existingUsers = require("../model/existingUsers");
const sendemailDetails = require("../model/sendMails");
const filedataupload = require("../model/fileupload");
const EnquiryDetails = require("../model/EnquiryDetails");
const async = require("hbs/lib/async");
const reader = require("xlsx");
const util = require("util");
const fs = require("fs");
const { log } = require("console");
const unlinkFile = util.promisify(fs.unlink);

module.exports = {
  //  create payment order and insert userid,orderId and username to database
  paymentOrder: async (req, res) => {
    try {
      console.log(req.body);
      if (req.body.paymentmode === "downpayment") {
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
                userName: req.body.userName,
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
                userName: req.body.userName,
                stage: req.body.stage,
                planname: req.body.planname,
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
            if (order.status === "created") {
              const payment = new paymentSchema({
                orderId: order.id,
                amount: order.amount,
                userId: req.body.userId,
                userName: req.body.userName,
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
  // verify payment and update payment status to database
  paymentVerify: (req, res) => {
    razorpayPayment
      .verifyPayment(req.body)
      .then((order) => {
        paymentSchema.findOneAndUpdate(
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
            if (err) {
              res.json({ error: err, message: "Payment updation failed" });
            } else {
              sendMail
                .receiptMail(order, data.userName)
                .then((mail) => {
                  sendMail
                    .welcomeMail(order.email, data.userName)
                    .then((welcomeMail) => {
                      res.redirect("https://agriha.arclif.com/success");
                    })
                    .catch((err) => {
                      res.json({
                        error: err,
                        message: "welcome mail sending failed",
                      });
                    });
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
  // file upload
  fileUpload: async (req, res) => {
    try {
      const file = reader.readFile(req.file.path);
      let data = [];
      const sheets = file.SheetNames;
      for (let i = 0; i < sheets.length; i++) {
        const temp = await reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );
        temp.forEach((res) => {
          data.push(res);
        });
      }
      if (data.length > 0) {
        var mailSuccess = 0;
        var mailfailed = 0;
        const result = await data.map((data) => {
          console.log(data);
        });
        unlinkFile(req.file.path);
      } else {
        res.json({
          status: 400,
          message: "Something went Wrong",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: error });
    }
  },
  // =====
  getContacts: async (req, res) => {
    try {
      const users = await existingUsers.find({});
      if (users) {
        res.json({ status: 200, totalContact: users.length, userData: users });
      } else {
        res.json({ status: 400, message: "Existing users data not found" });
      }
    } catch (error) {
      res.json(error);
    }
  },

  // Existing users send Mail notification
  ExistingusermailSend: async (req, res) => {
    try {
      const users = await existingUsers.find({});
      if (users) {
        const sendMail = users.map((data) => {
          console.log(data);
        });
      } else {
        res.json({ status: 400, message: "Existing users data not found" });
      }
    } catch (error) {
      res.json({ status: 400, message: "something went Wrong" });
    }
  },

  // Landing page Enquiry data save on database
  addenquirydetails: (req, res) => {
    try {
      const AddEnquiry = new EnquiryDetails({
        email: req.body.email,
        name: req.body.name,
        contact: req.body.contact,
        message: req.body.message,
      });
      AddEnquiry.save()
        .then((resp) => {
          res.json({ status: 200, message: "Enquiry added successfully" });
        })
        .catch((error) => {
          res.json({ status: 400, error: error.message });
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  },

  // Get enquiry details
  getenquiryDetails: async (req, res) => {
    try {
      const enquiryDetails = await EnquiryDetails.find({}).sort({ _id: -1 });
      if (enquiryDetails.length > 0) {
        res.json({ status: 200, enquiryData: enquiryDetails });
      } else {
        res.json({ status: 400, message: "Data not found" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  addProduct: (req, res) => {
    console.log(req.file);
    try {
      const product = new productSchema({
        productName: req.body.productname,
        productCategory: req.body.category,
        productPrice: req.body.price,
      });
    } catch (error) {
      res.json({ status: 400, error: error.message });
    }
  },
};
