const express = require("express")
const {check, validationResult} = require("express-validator")
const User = require("../model/user")
const bcrypt = require("bcrypt")
const router = express.Router()
const Auth = require("../midlewares/Auth")

const loginValidator = [
    check('email').exists().withMessage('Vui lòng nhập email người dùng.')
    .notEmpty().withMessage('Email người dùng không được bỏ trống')
    .isEmail().withMessage('Vui lòng nhập đúng email.'),
  
    check('password').exists().withMessage('Vui lòng nhập password')
    .notEmpty().withMessage('Password người dùng không được bỏ trống')
    .isLength({min:6}).withMessage("Password phải có ít nhất 6 kí tự")
]

router.get("/login",  Auth.isLogin, (req,res) =>{
  res.render("login")
})
  
router.post("/login",loginValidator,(req,res) => {
    let validation = validationResult(req)
      //validation=validation.mapped()
    let {email, password} = req.body
    if(validation.errors.length > 0) {
      req.session.flash = { 
        message: validation.errors[0].msg,
        type: "danger",
      }
      req.session.account = {
        email
      }
      return res.redirect("/login")
    }
    User.findOne({email}).then(u => {
      if(!u) {
        req.session.flash = { 
          message: "Tài khoản không tồn tại",
          type: "danger",
        }
        return res.redirect("/login")
      }
      else {
        let hash = u.password
        if(bcrypt.compareSync(password,hash)) {
          //login success
          req.session.user  = u
          res.redirect("/")
        }
        else {
          req.session.flash = { 
            message: "Sai email hoặc mật khẩu",
            type: "danger",
          }
          req.session.account = {
            email
          }
          return res.redirect("/login")
        }
      }
    })
    .catch(err => {
        req.session.flash = { 
          message: "Có lỗi trong quá trình xử lý vui lòng thử lại",
          type: "danger",
        }
        return res.redirect("/login")
    })
})
  
router.get("/register", Auth.isLogin, (req,res) => {
    res.render("register")
})
  
const registerValidator = [
    check('name').exists().withMessage("Vui lòng nhập tên người dùng.")
    .notEmpty().withMessage('Tên người dùng không được bỏ trống'), 

    check('email').exists().withMessage('Vui lòng nhập email người dùng.')
    .notEmpty().withMessage('Email người dùng không được bỏ trống')
    .isEmail().withMessage('Vui lòng nhập đúng email.'),

    check('password').exists().withMessage('Vui lòng nhập password')
    .notEmpty().withMessage('Password người dùng không được bỏ trống')
    .isLength({min:6}).withMessage("Password phải có ít nhất 6 kí tự"),

    check('rePassword').exists().withMessage('Vui lòng nhập xác nhận password')
    .notEmpty().withMessage('Vui lòng nhập xác nhận password')
    .custom(async (value, {req}) => {
        if(value != req.body.password) {
        throw new Error("Mật khẩu không khớp")
        }
        return true;
    })
]

router.post("/register",registerValidator,(req,res) => {
    let validation = validationResult(req)
      //validation=validation.mapped()
    let {name, email, password} = req.body
    if(validation.errors.length > 0) {
      req.session.flash = { 
        message: validation.errors[0].msg,
        type: "danger",
      }
      req.session.account = {
        name,
        email
      }
      return res.redirect("/register")
    }
    const hash = bcrypt.hashSync(password,10)
    const user = new User({
      fullname: name,
      email: email,
      password: hash
    })
    
    user.save()
    .then(() => {
      req.session.flash = { 
        message: "Bạn đã đăng ký thành công",
        type: "success",
      }
      res.redirect("/login")
    })
    .catch(err => {
        req.session.flash = { 
          message: err.message,
          type: "danger",
        }
        req.session.account = {
          name,
          email
        }
        return res.redirect("/register")
    })
    
})

router.get("/", Auth.authorize, (req,res) => {
  const account = req.session.user;
  User.find({}, function (err, users) {
    users = users.filter(u => u.email !== account.email)
    var context = {
      users: users.map(function (user) {
        return {
          email: user.email,
          name: user.fullname,
          id: user._id
        };
      }),
      fullname: req.session.user.fullname,
    };
    return res.render("index", context);
  });
})

router.get("/logout", (req,res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
})

module.exports = router