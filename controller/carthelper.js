const paymentplan = require('../model/paymentplan');


module.exports = {
    cartview: (req, res) => {
        paymentplan.find({_id:req.params.id},(err,data)=>{
              if(err){
                res.json({error:err,message:'Failed to get payment plan'});
              }else{
                res.json({status:200,data:data});
              }
       })
    }
        
}