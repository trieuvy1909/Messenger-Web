const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Conversation = new Schema({
    user1: {
        type: String,
        require: true
    },
    user2: {
        type: String,
        require: true
    },
})

module.exports = mongoose.model("Conversation", Conversation)