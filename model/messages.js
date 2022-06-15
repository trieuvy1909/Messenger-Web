const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Message = new Schema({
    user: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    room: {
        type: String,
        require: true
    },
    time: {
        type: Date
    }
})

module.exports = mongoose.model("Message", Message)