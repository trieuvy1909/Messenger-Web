const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Account = new Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    fullname: {
        type: String,
        require: true
    },
    phone:{
        type: String
    }
    ,
    birthday:{
        type: Date
    }
    ,
    gender:{
        type: String
    }
})

module.exports = mongoose.model("Account", Account)