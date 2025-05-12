const express = require('express');

const UploadController = require('../controllers/UploadController');

let router = express.Router();

router.post('/image', UploadController.uploadSingleImage);
router.post('/single', UploadController.uploadSingleImage);

module.exports = router; 