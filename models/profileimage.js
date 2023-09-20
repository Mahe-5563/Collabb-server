const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileImageSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
})

const ProfileImageModel = mongoose.model("ProfileImageModel", profileImageSchema);
module.exports = ProfileImageModel;