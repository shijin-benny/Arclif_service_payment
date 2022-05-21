const paymentSchema = require('../model/paymentSchema');
const razorpayPayment = require('../payment_Integration/razorpay');
const sendMail = require("../controller/Nodemailer/nodemailer");
const filedataupload = require('../model/fileupload');
const mongoose = require('mongoose');
const async = require('hbs/lib/async');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    //<!===== create payment order and inset userid,orderId to database =======/> //
    paymentOrder: async(req, res) => {
        try {
            if(req.body.stage && req.body.userId){
            const orderId = await paymentSchema.findOne({$and:[{userId:req.body.userId},{stage:req.body.stage}]});
            if(orderId){
                res.status(200).json({
                    status: 200,
                    order:{id: orderId.orderId, amount: orderId.amount,stage:orderId.stage}
                });
            }else{
                razorpayPayment.createOrder(req.body.amount).then(order => {
                    if (order.status === 'created') {
                        const paymentData = paymentSchema({
                            orderId: order.id,
                            userId: req.body.userId,
                            stage:req.body.stage,
                            amount:order.amount,
    
                        })
                        paymentData.save().then(data => {
                            res.json({ status: 200, order: { id: order.id, amount: order.amount,stage:data.stage} });
                        }
                        ).catch(err => {
                            console.log(err);
                            res.json({err:err,message:'something went wrong'});
                        })
                    }
                }).catch(err => {
                    console.log('error', err);
                    res.json({message:'something went wrong'});
                })
            }
        }else{
            console.log('error');
            res.json({message:'userId or stage is missing'});
        }
            
        } catch (error) {
            console.log(error);
            res.json({error:error,message:'something went wrong'});
        }

    },
    //<!========= verify payment and update payment status to database ========/>//
    paymentVerify: (req, res) => {
        razorpayPayment.verifyPayment(req.body).then(order => {
            console.log(order);
            paymentSchema.updateOne({ orderId:order.order_id}, {
                $set: {
                    paymentId: order.id,
                    amount: order.amount / 100,
                    paymentStatus: order.status,
                    method: order.method,
                    email: order.email,
                }
            }, (err, data) => {
                if (err) {
                    res.json({ error: err, message: 'Payment updation failed' });
                } else {
                    sendMail.receiptMail(order).then(mail => {
                        res.json({ status: 200, message: 'Payment verified successfully' });
                    }).catch(err => {
                        res.json({ error: err, message: 'Payment verified successfully but mail sending failed' });
                    })
                }
            }
            )
        }).catch(err => {
            res.json({ status: 500, message: 'Payment not verified' });
        })
    },
    delete: (req, res) => {
        console.log(req.body);
        paymentSchema.deleteMany({ userId: ObjectId(req.body.id) }, (err, data) => {
            if (err) {
                res.json({ error: err, message: 'Payment deletion failed' });
            } else {
                res.json({ status: 200, message: 'Payment deleted successfully' });
            }
        })
    },
    fileUpload: (req, res) => {
        try {
        console.log(req.body);
        console.log(req.params.id);
        console.log('file upload');
        const fileData = new filedataupload({
            login_id: req.params.id,
            filename: req.body.filename,
        })
        fileData.save().then(data => {
            res.json({ status: 200, message: 'File uploaded successfully' });
        }) .catch(err => {
            res.json({ error: err, message: 'File upload failed' });
        })             
        } catch (error) {
            console.log(error);
            res.json({error:error,message:'something went wrong'});
        }

    }
}