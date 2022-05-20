const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    description: String,
    creator: String,
    participants: Array,
    password: String,
    public: Boolean,
    tags: Array
})

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;