/* eslint-disable consistent-return */
const {
  check,
  validationResult
} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user');

// eslint-disable-next-line consistent-return
exports.signup = async (req, res) => {
  const dataToValidate = [
    check(req.body.isAdmin).isBoolean(),
    check(req.body.firstName).isLength({
      min: 3
    }).isAlpha(),
    check(req.body.lastName).isLength({
      min: 3
    }),
    check(req.body.email).isEmail(),
    check(req.body.gender).isIn(['male', 'female']),
    check(req.body.jobRole).isLength({
      min: 2
    }),
    check(req.body.department).isLength({
      min: 2
    }),
    check(req.body.address).isLength({
      min: 2
    }),
    check(req.body.password).isLength({
      min: 6
    }),
  ];
  const errors = validationResult(dataToValidate);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: errors.msg
    });
    return res.status(201).json({
      message: 'all data has passed validator'
    });
  }
  const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  const newUser = {
    isAdmin: false,
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
  const token = jwt.sign({ newUser }, process.env.secretKey, { expiresIn: '1h' });
  try {
    const save = await userModel.addUser(newUser);
    if (save) {
      res.status(201).json({
        status: 'success',
        token,
        message: 'User account successfully created',
        data: save.rows
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `error ${error} occured when trying to signup`
    });
  }
};

exports.signin = async (req, res) => {
  const dataToValidate = [
    check(req.body.email).isEmail(),
    check(req.body.password).isLength({ min: 6 }),
  ];
  const errors = validationResult(dataToValidate);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'incorrect format of parameters' });
  }
  const loginDetails = {
    email: req.body.email,
    password: req.body.password
  };
  console.log(loginDetails);
  // eslint-disable-next-line no-useless-catch
  try {
    await userModel.getUser(loginDetails.email)
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: 'user not found'
          });
        }
        bcrypt.compare(req.body.password, user.rows[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'incorrect password'
            });
          }
          if (result) {
            const token = jwt.sign({
              email: user.rows[0].email,
              userId: user.rows[0].id,
              lastName: user.rows[0].lastname
            }, process.env.secretKey, { expiresIn: '24h' });
            return res.status(201).json({
              message: 'login succesful',
              token,
              data: {
                id: user.rows[0].id,
                firstName: user.rows[0].firstname,
                lastName: user.rows[0].lastname
              }
            });
          }
          res.status(401).json({
            message: 'auth failed'
          });
        });
      })
      .catch((err) => {
        console.log('i am here');
        res.status(500).json({
          error: err
        });
      });
  } catch (err) {
    console.log('i am the errooorr');
    throw err;
  }
};
