const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const clientAccountDetailsSchema = new Schema({
    userid: {
        type: String,
        required: true,
    },
    accounttype: {
        type: String,
        required: true,
    },
    organisationname: {
        type: String,
    },
    website: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    locationcode: {
        type: String,
        required: true,
    },
    favourites: {
        type: Array,
        required: true,
    }
}, { timestamps: true });

const ClientAccDetailsModel = mongoose.model('ClientAccDetailsModel', clientAccountDetailsSchema);
module.exports = ClientAccDetailsModel;