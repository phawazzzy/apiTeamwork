const express = require('express');

const router = express.Router();

router.get('/gifs', (req, res) => {
  res.status(200).json({
    message: 'i am working oo'
  });
});


module.exports = router;
