const express = require('express');

const router = express.Router();
const articleController = require('../controllers/articleController');
const { checkEmp } = require('../middleware/authChecker');


router.get('/', (req, res) => {
  res.status(200).json({
    me: 'ji'
  });
});

router.post('/', checkEmp, articleController.createArticles);
router.patch('/:articleId', checkEmp, articleController.updateArticles);
router.delete('/:articleId', articleController.deleteArticles);
router.post('/:articleId/comment', articleController.commentArticle);
module.exports = router;
