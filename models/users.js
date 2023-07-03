const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userDetailsSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const UserDetailsModel = mongoose.model('UserDetailsModel', userDetailsSchema);
module.exports = UserDetailsModel;