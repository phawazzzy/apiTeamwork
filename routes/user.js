const express = require('express');

const router = express.Router();

const userController = require('../controllers/userControllers');

const auth = require('../middleware/authChecker');

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/auth/create-user', userController.signup);
router.post('/auth/signin', userController.signin);
router.get('/auth/get', auth, (req, res) => {
  res.status(200).json({
    message: 'yyyaayy i am allife'
  });
});

module.exports = router;
