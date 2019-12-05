/* eslint-disable consistent-return */
const { check, validationResult } = require('express-validator');
// const moment = require('moment');
const articleModel = require('../model/articles');
const getLogUser = require('../middleware/getLogUser');
// const pool = require('../config/config');


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

  await articleModel.oneArticle(article).then((result) => {
    if (result[1] < 1) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }
    if (result[0].userid === article.userid) {
      articleModel.UpdateArticles(article).then((result2) => {
        // console.log(result2);
        return res.status(201).json({
          status: 'success',
          message: 'Article successfully updated',
          data: {
            title: result2[0].title,
            Article: result2[0].content,
            dateUpdated: result2[0].dataupdated,
            userid: result2[0].userid
          },
        });
      });
    } else if (result[0].userid !== article.userid) {
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

exports.deleteArticles = async (req, res) => {
  const userid = await getLogUser(req);
  console.log(userid);

  const article = {
    articleid: +req.params.articleId,
    userid
  };
  console.log(article.articleid);

  try {
    const result = await articleModel.oneArticle(article);
    if (result[1] < 1) {
      res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }
    if (result[0].userid === article.userid) {
      const deletecomment = await articleModel.delcomment(article);
      if (deletecomment) {
        articleModel.DeleteArticle(article).then((result2) => {
          console.log(result2.rowCount);
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'Article successfully deleted',
            }
          });
        });
      }
    } else if (result[0].userid !== article.userid) {
      return res.status(401).json({
        message: 'You are Unauthorize to perform this operation'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Error ${error} occured`
    });
  }
};

exports.commentArticle = async (req, res) => {
  const dataToValidate = [
    check(req.body.comment).isLength({ min: 3 }),
    // check(req.body.content).isLength({ min: 25 })
  ];
  const error = validationResult(dataToValidate);
  if (!error.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'you title or content is not up to the required min length'
    });
  }
  const userid = await getLogUser(req);
  const comment = {
    articleid: +req.params.articleId,
    comment: req.body.comment,
    userid
  };
  console.log(comment.articleid);

  await articleModel.CommentArticle(comment).then((result) => {
    if (result) {
      console.log(result.rows[0]);
      articleModel.getArticles(comment).then((comRes) => {
        console.log(comRes);
        return res.status(201).json({
          status: 'success',
          data: {
            message: 'Comment successfully created',
            articleId: comRes[0].articleid,
            createdOn: comRes[1].datecreated,
            articleTitle: comRes[0].title,
            article: comRes[0].content,
            comment: comRes[1].comment,
            commentPoster: comRes[1].poster
          }
        });
      });
    }
  })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: `error ${err} occured`
      });
    });
};

exports.getOne = async (req, res,) => {
  const article = {
    articleid: req.params.articleId
  };
  try {
    const result = await articleModel.oneArticle(article);
    if (result[1] < 1) {
      res.status(404).json({
        status: 'Error',
        message: 'Article doesnt exist'
      });
    } else {
      await articleModel.getComments(article).then((result2) => {
        // console.log(result);
        console.log(...result2);
        res.status(200).json({
          status: 'success',
          data: {
            id: result[0].articleid,
            createdOn: result[0].datecreated,
            title: result[0].title,
            article: result[0].content,
            poster: result[0].author,
            comment: (result2[1] < 1) ? 'This article has no comment, be the first to comment' : result2[0].map((docs) => {
              return {
                commentId: docs.actionid,
                comment: docs.comment,
                authorId: docs.userid,
                commentPoster: docs.poster
              };
            })
          }
        });
      });
    }
  } catch (error) {
    res.status(200).json({
      status: 'error',
      message: `Error ${error} occured`,
    });
  }
};
