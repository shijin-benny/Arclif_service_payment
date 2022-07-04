const router = require("express").Router();
const helper = require("../controller/paymentHelper");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadfiles/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext === ".xlsx") {
      cb(null, true);
    }
    return cb(res.status(400).end("only Xlsx files"), false);
  },
});
var upload = multer({ storage: storage }).single("file");
//<!================ Payment Order =====================/>
router.post("/paymentOrder", helper.paymentOrder);

//<!================ Payment Verify =====================/>
router.post("/verifyPayment", helper.paymentVerify);

// router.post('/filedataupload/:id',helper.fileUpload);

router.get("/get", (req, res) => {
  res.render("index");
});
router.get("/receipt", (req, res) => {
  res.render("receipt");
});
router.get("/welcome", (req, res) => {
  res.render("welcomeMail");
});

// router.post("/filedataupload", upload, helper.fileUpload);
router.get("/contactCount", helper.getContacts);
router.get("/sendMail", helper.ExistingusermailSend);
router.post("/enquiry", helper.addenquirydetails);
router.get("/getenquiry", helper.getenquiryDetails);

module.exports = router;
