const express = require('express');
const router = express.Router();

const service = require('../services/catways');

router.get('/', service.get);
router.get('/:id', service.getById);
router.post('/', service.add);
router.put('/:id', service.updateAll);
router.patch('/:id', service.update);
router.delete('/:id', service.delete);

module.exports = router;
