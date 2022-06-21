const express = require("express")
const {check, validationResult} = require("express-validator")
const User = require("../model/user")
const bcrypt = require("bcrypt")
const router = express.Router()
const Auth = require("../midlewares/Auth")
const changePassValidator = require('../midlewares/changePassValidator');
const registerValidator = require('../midlewares/registerValidator');
const loginValidator = require('../midlewares/loginValidator');

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
      res.redirect("/login?message=register_thanhcong")
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

router.get("/changepassword", (req,res) => {
  res.render("changepassword")
})

router.post('/changepassword', changePassValidator, (req, res) => {
  let validation = validationResult(req)
  let { oldpass, confirm1, confirm2 } = req.body;
  let user = req.session.user;
  if(validation.errors.length > 0) {
    req.session.flash = { 
      message: validation.errors[0].msg,
      type: "danger",
    }
    return res.redirect("/changepassword")
  }
  if (validation.errors.length === 0) {
      if (user) {
          if (bcrypt.compareSync(oldpass, user.password)) {
              if (confirm1 === confirm2) {
                  bcrypt
                      .hash(confirm2, 10)
                      .then((hashed) => {
                          User.findByIdAndUpdate(user._id, {
                              password: hashed,
                          }).then(() => {
                              return res.redirect("changepassword?message=changpassword_thanhcong");
                          });
                      })
                      .catch((err) => {
                        req.session.flash = { 
                          message: 'Lỗi đổi password!',
                          type: "danger",
                        }
                        return res.render("changepassword");
                      });
              } else {
                  req.session.flash = { 
                    message: 'Mật khẩu không khớp!',
                    type: "danger",
                  }
                  return res.render("changepassword");
              }
          } else {
              req.session.flash = { 
                message: 'Mật khẩu cũ không đúng!',
                type: "danger",
              }
              return res.render("changepassword");
          }
      } else {
          res.redirect("/");
      }
  }
});
module.exports = router