const express = require("express");
const app = express()
const server = require("http").createServer(app)
const handlebars = require("express-handlebars")
const session = require("express-session")
const cookie = require("cookie-parser")
const path = require("path")
const UserRouter = require("./routers/user")
const ChatRouter = require("./routers/chat")
const Mongodb = require('./config/database');
const { Server, Socket } = require("socket.io");
const Messages = require("./model/messages")
const User = require("./model/messages");
const { dirname } = require("path");
const io = new Server(server)
// const WebSocketServer  = require("ws")
// const wss = new WebSocketServer.Server({server: server})
Mongodb.connect()

app.engine(
  "hbs",
  handlebars.engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'views/partials'),
  ],
    helpers: {
      style: (senderid, userid)=>{
        if(senderid !== userid) return "hoder"
        return "me"
      }
    }
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");
app.use(express.json())
app.use(express.urlencoded())
app.use(cookie('GKWebNc'));
app.use(session({ cookie: { maxAge: 6000000 }}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  res.locals.account = req.session.account;
  delete req.session.account;
  next();
})


app.use("/", UserRouter)
app.use("/chat", ChatRouter)

io.on("connection", (socket) => {

  //join room
  socket.on("joinRoom", (roomid) => {
    socket.join(roomid)
    socket.emit("joined", "bạn đã vào phòng" + roomid)
  })

  // get message form client and broastcast to another
  socket.on("chat", send => {
    let message = new Messages({
      user: send.user,
      message: send.message,
      room: send.room,
      time: send.time
    })
    message.save()
    .then(m => {
      socket.to(m.room).emit("message", message)
    })
    .catch(e => {
      console.log(e)
    })
  })

})


app.listen(process.env.PORT || 3000, () => {
    console.log("http://localhost:" + process.env.PORT)
})