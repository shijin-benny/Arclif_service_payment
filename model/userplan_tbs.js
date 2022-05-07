const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const userplan= new mongoose.Schema({
     login_id:{
            type:ObjectId,
     },
     paymentplan_id:{
            type:ObjectId,
        },
}, { timestamps: true });

module.exports = mongoose.model('userplan_tbs', userplan);