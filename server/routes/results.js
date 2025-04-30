const express = require('express');
const router = express.Router();
const { saveResult, getResultsByUser } = require('../controllers/resultsController');

router.post('/', saveResult);

router.get('/:userId', getResultsByUser);

module.exports = router;

//Defines the route for saving results