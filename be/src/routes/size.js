const express = require('express');

const SizeController = require('../controllers/SizeController');

let router = express.Router();

router.post('/create', SizeController.create);

router.put('/update', SizeController.update);

router.delete('/delete/:size_id', SizeController.remove);

router.get('/list', SizeController.list);

module.exports = router;
