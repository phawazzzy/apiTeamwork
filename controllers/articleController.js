/* eslint-disable consistent-return */
const { check, validationResult } = require('express-validator');
// const moment = require('moment');
const articleModel = require('../model/articles');
const getLogUser = require('../middleware/getLogUser');

// eslint-disable-next-line consistent-return
exports.createArticles = async (req, res) => {
  const dataToValidate = [
    check(req.body.title).isLength({ min: 3 }),
    check(req.body.content).isLength({ min: 25 })
  ];
  const error = validationResult(dataToValidate);
  if (!error.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'you title or content is not up to the required min length'
    });
  }
  const userid = await getLogUser(req);
  console.log(userid);
  const article = {
    title: req.body.title,
    content: req.body.content,
    userid
  };
  try {
    const result = await articleModel.articlePost(article);
    if (result) {
      console.log(result.rows[0]);
      return res.status(201).json({
        status: 'Success',
        data: {
          articleid: result.rows[0].articleid,
          message: 'Article succesfully posted',
          title: result.rows[0].title,
          content: result.rows[0].content,
          dataCreated: result.rows[0].dateCreated,
          dateUpdated: result.rows[0].dateUpdated,
          userid: result.rows[0].userid
        }
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: `error ${error}`
    });
  }
};

exports.updateArticles = async (req, res) => {
  const dataToValidate = [
    check(req.body.title).isLength({ min: 3 }),
    check(req.body.content).isLength({ min: 25 })
  ];
  const error = validationResult(dataToValidate);
  if (!error.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'you title or content is not up to the required min length'
    });
  }
  const userid = await getLogUser(req);
  console.log(userid);

  const article = {
    articleid: req.params.articleId,
    title: req.body.title,
    content: req.body.content,
    dateupdated: Date.now(),
    userid
  };

  articleModel.getArticles(article).then((result) => {
    // console.log(result.rows[0]);

    if (result.rows[0].userid === article.userid) {
      const okay = articleModel.UpdateArticles(article);
      //   console.log(okay);
      if (okay) {
        return res.status(201).json({
          status: 'Article has been updated succesfully',
          data: {
            title: okay.title,
            Article: okay.content
          }
        });
      }
    } else {
      res.status(401).json({
        status: 'error',
        message: 'you are unathorized to edit this'
      });
    }
  }).catch((err) => {
    res.status(500).json({
      status: 'error',
      message: `Error ${err} occured`
    });
  });
};
