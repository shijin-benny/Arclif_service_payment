const router = require("express").Router();
const paymenthelper = require("../controller/paymentHelper");

//<!================ Payment Order =====================/>
router.post("/paymentOrder", paymenthelper.paymentOrder);

//<!================ Payment Verify =====================/>
router.post("/verifyPayment/:id", paymenthelper.paymentVerify);

// router.post('/filedataupload/:id',paymenthelper.fileUpload);

router.get("/get", (req, res) => {
  res.render("index");
});
router.get("/receipt", (req, res) => {
  res.render("welcome");
});
router.get("/welcome", paymenthelper.welcome);

module.exports = router;
