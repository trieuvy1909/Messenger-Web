const express = require("express")
const router = express.Router()
const Conversation = require("../model/conversation")
const Auth = require("../../midlewares/Auth")
const Messages = require("../model/messages")
const User = require("../model/user")
const chat_controller = require("../controller/chat_controller")

router.get("/:id", Auth.authorize , chat_controller.join_room);
module.exports = router