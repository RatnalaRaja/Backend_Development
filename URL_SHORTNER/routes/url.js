const express = require('express');
const { shortURL,analytics } =require('../controller/url')
const router = express.Router();

router.post('/',shortURL);
router.get('/analytics/:shortId',analytics);
module.exports = router;