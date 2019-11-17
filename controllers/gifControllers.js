/* eslint-disable consistent-return */
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const cloudinary = require('../middleware/cloud-config');


const gifModel = require('../model/gif');
// const { checkAdmin, checkEmp } = require('../middleware/authChecker');
const getLogUser = require('../middleware/getLogUser');


exports.addGif = async (req, res) => {
  const file = req.file;
  console.log(file);
  console.log(req.body.title);

  const dataToValidate = [
    check(req.body.title).isLength({ min: 3 }),
    check(file.originalname).isLength({ min: 3 }).isMimeType('image/gif'),

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
  const userid = await getLogUser(req);
  console.log(userid);
  // const uploader = await upload.single('gif');
  //   const cloudStorage = await cloudStorage.
  // console.log(req.body.title);
  // console.log(file)


  // console.log('file upload in progress');
  // console.log(cloud_name);
  const newGif = {
    title: req.body.title,
    imageurl: file.path,
    public_id: file.path,
    userid
  };
  console.log(newGif);
  // console.log('i could see this lline');
  try {
    console.log('tring to pull of oooo');

    // const result =
    await gifModel.gifPost(newGif).then((result) => {
     return res.status(201).json({
        status: 'success',
        data: {
          gifId: result.gifId
        }
      })
    })
    console.log('tring to pull of');
    // if (result) {
    //   console.log(result);
    //   return res.status(201).json({
    //     status: 'success',
    //     data: {
    //       gifId: result.gifId,
    //       message: 'gif successfully uploaded',
    //       createdOn: result.dateCreated,
    //       title: result.title,
    //       imageurl: result.imageurl,
    //       public_url: result.public_id,
    //       userid: result.userid
    //     }
    //   });
    // }
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'i dey here',
      error
    });
  }
};
