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

  try {
    const result = await gifModel.oneGif(gif);
    if (result[1] < 1) {
      res.status(404).json({
        status: 'error',
        message: 'Gif not found'
      });
    }
    if (result[0].userid === gif.userid) {
      const delcomment = await gifModel.delcomment(gif);
      if (delcomment) {
        gifModel.DeleteGif(gif).then((result2) => {
          console.log(result2.rowCount);
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'Gif successfully deleted',
            }
          });
        });
      }
    } else if (result[0].userid !== gif.userid) {
      return res.status(401).json({
        message: 'You are Unauthorized to perform this operation'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Error ${error} occured`
    });
  }

  // await gifModel.getGifs(gif).then((result) => {
  //   console.log(result);
  //   if (result.rowCount < 1) {
  //     console.log('i got here1');
  //     res.status(404).json({
  //       status: 'error',
  //       message: 'gif not found',
  //     });
  //   }
  //   console.log('i got here2');
  //   if (result.rows[0].userid === gif.userid) {
  //     console.log('right poster');
  //     gifModel.delcomment(gif).then((deletecomment) => {
  //       if (deletecomment) {
  //         gifModel.DeleteGif(gif).then((result2) => {
  //           console.log(result2.rowCount);
  //           res.status(200).json({
  //             status: 'success',
  //             data: {
  //               message: 'gif successfully deleted'
  //             }
  //           });
  //         });
  //       }
  //     });
  //   } else if (result.rows[0].userid !== gif.userid) {
  //     return res.status(401).json({
  //       message: 'You are Unauthorize to perform this operation'
  //     });
  //   }
  // })
  //   .catch((err) => {
  //     res.status(500).json({
  //       status: 'error',
  //       message: `Error ${err} occured`
  //     });
  //   });
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
            commentPoster: comRes[1].poster

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

exports.getOne = async (req, res,) => {
  const gif = {
    gifid: req.params.gifId
  };
  try {
    const result = await gifModel.oneGif(gif);
    console.log(result);
    if (result[1] < 1) {
      res.status(404).json({
        status: 'Error',
        message: 'gif doesnt exist'
      });
    } else {
      await gifModel.getComments(gif).then((result2) => {
        // console.log(result);
        // console.log(...result2);
        res.status(200).json({
          status: 'success',
          data: {
            id: result.gifid,
            createdOn: result[0].datecreated,
            title: result[0].title,
            url: result[0].imageurl,
            poster: result[0].author,
            comment: (result2[1] < 1) ? 'This gif has no comment, be the first to comment' : result2[0].map((docs) => {
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
