const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;


const MessagesSchema = new Schema({
    clientid: {
        type: String,
        required: true,
    },
    talentid: {
        type: String,
        required: true,
    },
    threadtitle: {
        type: String,
        required: true,
    },
    messages: {
        type: Array,
        required: true,
    }
});

const MessagesModel = Mongoose.model("MessagesModel", MessagesSchema);
module.exports = MessagesModel;