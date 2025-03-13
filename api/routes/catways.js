const express = require('express');
const router = express.Router();

const service = require('../services/catways');

router.get('/catways', service.get);
router.get('/catways/:id', service.getById);
router.post('/catways', service.add);
router.patch('/catways/:id', service.update);
router.delete('/catways/:id', service.delete);

module.exports = router;
