const express = require('express');
const router = express.Router();

const service = require('../services/reservations');

router.get('/', service.get);
router.get('/:idReservation', service.getById);
router.post('/', service.add);
router.delete('/:id', service.delete);

module.exports = router;
