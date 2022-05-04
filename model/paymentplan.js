const mongoose = require('mongoose');

const planSchema= new mongoose.Schema({
      plan_name:{
            type:String,
      },
      plan_amount:{
            type:Number,
      },
      initial_payment:{
            type:Number,
        },
     plan_service:[],
     amount_per_sqrft:{
            type:Number,
     },
     plan_amount_inlakh:{
            type:String,
        },

}, { timestamps: true });

module.exports = mongoose.model('paymentplan_tbs', planSchema);