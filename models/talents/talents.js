const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const talentAccountDetailsSchema = new Schema({
    userid: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
    categoryid: {
        type: String,
        required: true,
    },
    subcategoryid: {
        type: String,
        required: true,
    },
    skills: {
        type: Array,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rate: {
        type: String,
        required: true,
    },
    paytype: {
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
    workstatus: {
        type: String,
        required: true,
    },
    myjobs: {
        type: Array,
        required: true,
    }
}, { timestamps: true });

const TalentAccDetailsModel = mongoose.model('TalentAccDetailsModel', talentAccountDetailsSchema);
module.exports = TalentAccDetailsModel;