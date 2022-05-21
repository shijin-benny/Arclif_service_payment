
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const UserFileStoreSchema = new mongoose.Schema({
    login_id: { type:ObjectId, ref: "login_tb", required: true },
    filename: { type:String, required: true }

}, { timestamps: true });

module.exports = mongoose.model('userfilestore_tb', UserFileStoreSchema);