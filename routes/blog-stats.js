const express = require('express');
const  { stats } = require('../controller/blog-stats')
const router = express.Router();

router.get('/', stats)

module.exports = router;