const express = require('express');

const ColourController = require('../controllers/ColourController');

let router = express.Router();

router.post('/create', ColourController.create);

router.put('/update', ColourController.update);

router.delete('/delete/:colour_id', ColourController.remove);

router.get('/list', ColourController.list);

module.exports = router;
