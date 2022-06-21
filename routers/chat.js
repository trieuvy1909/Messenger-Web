const express = require("express")
const router = express.Router()
const Conversation = require("../model/conversation")
const Auth = require("../midlewares/Auth")
const Messages = require("../model/messages")
const User = require("../model/user")

router.get("/:id", Auth.authorize ,async (req,res) => {
    let id = req.params.id

    // check if user is exist
    let receiver = await User.findById(id).catch(e => {
      console.log(e)
    })
    if(!receiver) {
      return res.redirect("/")
    }
    
    //get conversation
    let conver = await Conversation.findOne({
        user1: req.session.user._id,
        user2: id
    })

    if(!conver) {
        conver = await Conversation.findOne({
            user2: req.session.user._id,
            user1: id
        })
        if(!conver){
            conver = new Conversation({
                user2: req.session.user._id,
                user1: id
            })
            conver = await conver.save()
        }
    }

    //session for room id
    req.session.room = conver._id

    let users = await User.find({})
    users = users.filter(u => u.email !== req.session.user.email)
    //get message in the room
    const messages = await Messages.find({room: conver._id}).sort({time: 1})

    var context = {
        messages: messages.map(function (message) {
            let style;
            if(req.session.user._id.toString() !== message.user){
                style = "hoder"
            }
            else {
                style = "me"
            }
            
          return {
            sender: message.user,
            style: style,
            message: message.message,
            time: message.time.getDate()+'-'+(message.time.getMonth()+1)+'-'+message.time.getFullYear()+' '
            +message.time.getHours()+":"+message.time.getMinutes()
          };
        }),

        users: users.map(function (user) {
          return {
            email: user.email,
            name: user.fullname,
            id: user._id
          };
        }),
        
        roomid: conver._id,
        userid: req.session.user._id,
        fullname: req.session.user.fullname,
        receiver_id:id,
        receiver_fullname: receiver.fullname
      };
    return res.render("chat", context)
})

module.exports = router