const paymentSchema = require('../model/paymentSchema');
const razorpayPayment = require('../payment_Integration/razorpay');

module.exports = {
    paymentOrder:(req,res)=>{
       razorpayPayment.createOrder().then(order=>{
           if(order.status === 'created'){
               const paymentData = paymentSchema({
                     orderId:order.id,
                     userId:req.body.userId,
               })
                paymentData.save().then(data=>{
                    res.json({status:200,order:order});
                }
                ).catch(err=>{
                    res.json(err);
                })
           }
    }).catch(err=>{
        res.json(err);
    })
    },

    paymentVerify:(req,res)=>{
        razorpayPayment.verifyPayment(req.body).then(order=>{
           paymentSchema.updateOne({userId:req.params.id},{
                paymentId:order.razorpay_payment_id,
                amount:order.amount,
                paymentStatus:order.status,
                method:order.method,
                email:order.email,
                orderId:order.order_id
              },(err,data)=>{
                if(err){
                    res.json({error:err,message:'Payment updation failed'});
                }else{
                    res.json({status:200,message:'Payment Successfull'});
                }
            }
            )
        }).catch(err=>{
            res.json({status:500,message:'Payment not verified'});
        })
    }  
}