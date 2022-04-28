const router = require('express').Router();
const payment = require('../payment_Integration/razorpay');
const userhelper = require('../controller/userhelper');

// ================ Payment Order ===================== //

router.post('/paymentOrder',userhelper.paymentOrder)

// ================ Payment Verify ===================== //

router.post('/verifyPayment/:id',userhelper.paymentVerify);


router.get('/get', (req, res) => {
    res.render('index')
})

module.exports = router;