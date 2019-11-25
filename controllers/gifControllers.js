/* eslint-disable consistent-return */
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const gifModel = require('../model/gif');
const getLogUser = require('../middleware/getLogUser');
const cloudStorage = require('../middleware/cloud-config');

exports.addGif = async (req, res) => {
  const file = req.files.image;
  // console.log(file);
  // console.log(req.body.title);

  const dataToValidate = [
    check(req.body.title).isLength({ min: 3 }),
    check(file.mimetype).isMimeType('image/gif'),

  ];
  const errors = validationResult(dataToValidate);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'data validation didnt pass'
    });
    return res.status(200).json({
      message: 'All data pass validation test'
    });
  }
  if (file.mimetype !== 'image/gif') {
    return res.status(400).json({
      message: 'please we only accept gif'
    });
  }
  const userid = await getLogUser(req);
  const image = await cloudStorage.uploader.upload(file.tempFilePath, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error} occured` });
    }
    return result;
  });
  const newGif = {
    title: req.body.title,
    imageurl: image.secure_url,
    public_id: image.public_id,
    userid
  };
  try {
    const result = await gifModel.gifPost(newGif);
    console.log('tring to pull of');
    if (result) {
      console.log(result.rows[0]);
      return res.status(201).json({
        status: 'success',
        data: {
          gifId: result.rows[0].gifId,
          message: 'gif successfully uploaded',
          createdOn: result.rows[0].dateCreated,
          title: result.rows[0].title,
          imageurl: result.rows[0].imageurl,
          public_id: result.rows[0].public_id,
          userid: result.rows[0].userid
        }
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'i dey here',
      error
    });
  }
};

exports.deleteGif = async (req, res) => {
  const userid = await getLogUser(req);
  console.log(userid);

  const gif = {
    gifid: +req.params.gifid,
    userid
  };

  await gifModel.getGifs(gif).then((result) => {
    if (result.rowCount < 1) {
      res.status(404).json({
        status: 'error',
        message: 'gif not found',
      });
    }
    if (result.rows[0].userid === gif.userid) {
      gifModel.DeleteGif(gif).then((result2) => {
        console.log(result2.rowCount);
        res.status(200).json({
          status: 'success',
          data: {
            message: 'gif successfully deleted'
          }
        });
      });
    } else if (result.rows[0].userid !== gif.userid) {
      return res.status(401).json({
        message: 'You are Unauthorize to perform this operation'
      });
    }
  })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: `Error ${err} occured`
      });
    });
};

exports.commentGif = async (req, res) => {
  const dataToValidate = [
    check(req.body.comment).isLength({ min: 3 }),
  ];
  const error = validationResult(dataToValidate);
  if (!error.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'you comment isnt up 3 words'
    });
  }
  const userid = await getLogUser(req);
  const comment = {
    gifid: +req.params.gifid,
    comment: req.body.comment,
    userid
  };

  await gifModel.CommentGif(comment).then((result) => {
    if (result) {
      console.log(result.rows[0]);
      gifModel.getGifs(comment).then((comRes) => {
        console.log(comRes);
        res.status(200).json({
          status: 'success',
          data: {
            message: 'Comment successfully created',
            createdOn: comRes[1].datecreated,
            gifTitle: comRes[0].title,
            comment: comRes[1].comment,
          }
        });
      });
    }
  })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: `Error ${err} occured`
      });
    });
};
