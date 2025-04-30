const express = require('express');
const router = express.Router();
const { saveResult } = require('../controllers/resultsController');

router.post('/', saveResult);

module.exports = router;

//Defines the route for saving results