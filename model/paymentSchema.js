const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
    },
    amount: {
        type: Number,
    },
    userId: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
    },
    method: {
        type: String,

    },
    email:{
        type:String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);