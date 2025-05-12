const express = require('express');

const AboutController = require('../controllers/AboutController');

let router = express.Router();

router.get('/info', AboutController.getAboutInfo);

router.put('/update', AboutController.updateAboutInfo);

module.exports = router; 