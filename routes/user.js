const express = require('express');

const router = express.Router();

const userController = require('../controllers/userControllers');

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/auth/create-user', userController.signup);


module.exports = router;
