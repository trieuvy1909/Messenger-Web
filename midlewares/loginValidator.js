const { check } = require('express-validator');
module.exports = [
    check('email').exists().withMessage('Vui lòng nhập email người dùng.')
    .notEmpty().withMessage('Email người dùng không được bỏ trống')
    .isEmail().withMessage('Vui lòng nhập đúng email.'),
  
    check('password').exists().withMessage('Vui lòng nhập password')
    .notEmpty().withMessage('Password người dùng không được bỏ trống')
    .isLength({min:6}).withMessage("Password phải có ít nhất 6 kí tự")
];