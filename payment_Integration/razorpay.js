const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
  //<!================== create Order ===========================/>//
  createOrder: (amount) => {
    try {
      return new Promise((resolve, reject) => {
        razorpay.orders.create(
          {
            amount: amount * 1000,
            currency: "INR",
          },
          function (err, order) {
            if (err) {
              reject(err);
            } else {
              resolve(order);
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  },
  //<!================== verify payment ===========================/>//
  verifyPayment: (paymentData) => {
    console.log(paymentData);
    return new Promise((resolve, reject) => {
      razorpay.payments.fetch(
        paymentData.razorpay_payment_id,
        function (err, payment) {
          if (err) {
            reject(err);
          } else {
            if (
              payment.status === "captured" ||
              payment.status === "authorized"
            ) {
              resolve(payment);
            } else {
              reject({ error: "Payment not captured" });
            }
          }
        }
      );
    });
  },
};
