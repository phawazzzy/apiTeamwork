const express = require('express');
const gifController = require('../controllers/gifControllers');
// const upload = require('../middleware/multerMid');


const router = express.Router();

// router.post('/', (req, res) => {
//   let material = req.body.material;
//   console.log(material);
//   res.status(200).json({
//     message: 'i am working oo'
//   });
// });

router.post('/gifs', gifController.addGif);

// router.post('/gifs', (req, res) => {
//   console.log(req.files)
// })


module.exports = router;
