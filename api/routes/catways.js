const express = require('express');
const router = express.Router();

const service = require('../services/catways');

router.get('/', service.get);
router.get('/:catwayNumber', service.getById);
router.post('/', service.add);
router.put('/:catwayNumber', service.updateAll);
router.patch('/:catwayNumber', service.update);
router.delete('/:catwayNumber', service.delete);

module.exports = router;
