/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
// const moment = require('moment');
const userModel = require('../model/user');

// const finetime = moment().format('MMMM Do YYYY, h:mm:ss a');


const checkAdmin = async (req, res, next) => {
  try {
    const gettoken = req.headers.authorization;
    if (gettoken) {
      const token = gettoken.split(' ')[1];
      const decode = jwt.verify(token, process.env.secretKey);
      const userMail = decode.email;
      const {
        rows
      } = await userModel.getUser(userMail);
      if (rows[0].isadmin === true) {
        next();
        const authDetails = {
          token: userMail,
          isAdmin: rows[0].isadmin
        };
        return authDetails;
      }
      res.status(401).json({
        message: 'you are not an admin so you cant perform this operation'
      });
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'No token provided'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
};

const checkEmp = async (req, res, next) => {
  try {
    const gettoken = req.headers.authorization;
    if (gettoken) {
      const token = gettoken.split(' ')[1];
      const decode = jwt.verify(token, process.env.secretKey);
      const userMail = decode.email;
      const {
        rows
      } = await userModel.getUser(userMail);
      // console.log(rows);
      if (rows[0].email !== userMail) {
        res.status(401).json({
          message: 'you are not an employee in this company'
        });
      }
      next();
      const authDetails = {
        token: userMail
      };
      return authDetails;
    }
    return res.status(403).json({
      status: 'error',
      message: 'No token provided'
    });
  } catch (err) {
    res.status(500).json({
      status: 'Auth failed',
      error: err.name,
      message: err.message,
      expiredTime: err.expiredAt
    });
  }
};

module.exports = {
  checkAdmin,

  checkEmp
};
