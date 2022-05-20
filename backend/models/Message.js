const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
    sender: String,
    group: String,
    message: String
})

const Message = mongoose.model("Message", msgSchema);

module.exports = Message;