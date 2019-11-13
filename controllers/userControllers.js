const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const userModel = require('../model/user');

// eslint-disable-next-line consistent-return
exports.signup = async (req, res) => {
  const dataToValidate = [
    check(req.body.isAdmin).isBoolean(),
    check(req.body.firstName).isLength({ min: 3 }).isAlpha(),
    check(req.body.lastName).isLength({ min: 3 }),
    check(req.body.email).isEmail(),
    check(req.body.gender).isIn(['male', 'female']),
    check(req.body.jobRole).isLength({ min: 2 }),
    check(req.body.department).isLength({ min: 2 }),
    check(req.body.address).isLength({ min: 2 }),
    check(req.body.password).isLength({ min: 6 }),
  ];
  const errors = validationResult(dataToValidate);
  if (!errors.isEmpty()) {
    res.status(400, errors.msg);
    return res.status(201).json({
      message: 'all data has passed validator'
    });
  }
  const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  const newUser = {
    isAdmin: req.body.isAdmin,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    gender: req.body.gender,
    jobRole: req.body.jobRole,
    department: req.body.department,
    address: req.body.address,
    password: hash,
  };
  console.log(newUser);
  const save = await userModel.addUser(newUser);
  if (save) {
    res.status(201).json({
      message: 'User account successfully created',
      result: save.rows
    });
  }
  return res.status(400).json({ message: 'error while saving user' });
};

// exports.signin = async (req, res) => {
//   const dataToValidate = [
//     check(req.body.email).isEmail(),
//     check(req.body.password).isLength({ min: 6 }),
//   ];
//   const errors = validationResult(dataToValidate);
//   if (errors) {
//     res.status(400).json({ message: 'incorrect format of parameters' });
//   }
//   const loginDetails = {
//     email: req.body.body.email,
//   }
// }
