const express = require("express")
const User = require("../model/user")
const bcrypt = require("bcrypt")
const router = express.Router()
const Auth = require("../../midlewares/Auth")
const changePassValidator = require('../../midlewares/changePassValidator');
const registerValidator = require('../../midlewares/registerValidator');
const loginValidator = require('../../midlewares/loginValidator');
const user_controller = require("../controller/user_controller")

router.get("/uploadavatar",  (req,res) =>{
  res.render("tinhnangdangphattrien")
})

router.get("/updateinformation", (req,res) =>{
  res.render("updateinformation")
})

router.post("/updateinformation",loginValidator,user_controller.updateinformation);

router.get("/login",  Auth.isLogin, (req,res) =>{
  res.render("login")
})
router.post("/login",loginValidator,user_controller.login);


router.get("/register", Auth.isLogin, (req,res) => {
    res.render("register")
})
router.post("/register",registerValidator,user_controller.register);


router.get("/", Auth.authorize, user_controller.gohomepage);

router.get("/logout", user_controller.logout);

router.get("/changepassword", (req,res) => {
  res.render("changepassword")
})

router.post('/changepassword', changePassValidator, user_controller.changepassword);
module.exports = router