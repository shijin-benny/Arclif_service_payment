const router = require('express').Router();
const payment = require('../payment_Integration/razorpay');
const paymenthelper = require('../controller/paymentHelper');

// ================ Payment Order ===================== //
router.post('/paymentOrder',paymenthelper.paymentOrder)

// ================ Payment Verify ===================== //
router.post('/verifyPayment/:id',paymenthelper.paymentVerify);

// ================ Cart view ===================== //


router.get('/mail',(req,res)=>{
    res.render('receipt');
})

router.get('/delete',paymenthelper.delete);

router.get('/get', (req, res) => {
    res.render('index')
})

module.exports = router;