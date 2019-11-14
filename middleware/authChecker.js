/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const userModel = require('../model/user');


module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.secretKey);
    const userMail = decode.email;
    const { rows } = await userModel.getUser(userMail);
    if (rows[0].isadmin === true) {
      next();
      const authDetails = { token: userMail, isAdmin: rows[0].isadmin };
      return authDetails;
    }
    res.status(401).json({
      message: 'you are Unathorized to perform this operation'
    });
  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
};
