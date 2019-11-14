const express = require('express');

const router = express.Router();

const userController = require('../controllers/userControllers');

const { checkAdmin, checkEmp } = require('../middleware/authChecker');

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/create-user', checkAdmin, userController.signup);
router.post('/signin', userController.signin);
router.get('/get', checkEmp, (req, res) => {
  res.status(200).json({
    message: 'yyyaayy i am allife'
  });
});

module.exports = router;
