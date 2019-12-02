const express = require('express');

const router = express.Router();

const feedController = require('../controllers/feedController');
const { checkEmp } = require('../middleware/authChecker');

router.get('/', checkEmp, feedController.feed);

module.exports = router;
