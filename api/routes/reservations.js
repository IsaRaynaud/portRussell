const express = require('express');
const router = express.Router({ mergeParams: true });

const service = require('../services/reservations');
const { checkJWT, isAdmin, isClient } = require('../middlewares/private');

router.use(checkJWT, isAdmin, isClient)

router.use((req, res, next) => {
    req.catwayNumber = parseInt(req.params.catwayNumber);
    console.log("Catway Number extrait :", req.catwayNumber);
    next();
});

router.get('/', service.get);
router.get('/:idReservation', service.getById);
router.post('/', service.add);
router.delete('/:idReservation', service.delete);

module.exports = router;
