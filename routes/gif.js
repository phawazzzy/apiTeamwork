const express = require('express');

const router = express.Router();
const gifController = require('../controllers/gifControllers');
// const upload = require('../middleware/multerMid');
// router.post('/', (req, res) => {
//   let material = req.body.material;
//   console.log(material);
//   res.status(200).json({
//     message: 'i am working oo'
//   });
// });

router.post('/', gifController.addGif);
router.delete('/:gifid', gifController.deleteGif);

// router.post('/gifs', (req, res) => {
//   console.log(req.files)
// })


module.exports = router;
