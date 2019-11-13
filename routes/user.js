const express = require('express');

const router = express.Router();

const userController = require('../controllers/userControllers');

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/auth/create-user', userController.signup);
router.post('/auth/signin', userController.signin);


module.exports = router;
