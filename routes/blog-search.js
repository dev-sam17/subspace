const express = require('express');
const searchResults = require('../controller/blog-search');
const router = express.Router();

router.get('/', searchResults)

module.exports = router