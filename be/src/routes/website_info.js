const express = require('express');

const WebsiteInfoController = require('../controllers/WebsiteInfoController');

let router = express.Router();

router.get('/info', WebsiteInfoController.getWebsiteInfo);

router.put('/update', WebsiteInfoController.updateWebsiteInfo);

module.exports = router; 