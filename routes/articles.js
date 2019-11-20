const express = require('express');

const router = express.Router();
const articleController = require('../controllers/articleController');


router.get('/', (req, res) => {
  res.status(200).json({
    me: 'ji'
  });
});

router.post('/', articleController.createArticles);
router.patch('/:articleId', articleController.updateArticles);

module.exports = router;
