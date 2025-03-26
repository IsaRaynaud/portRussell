const express = require('express');
const router = express.Router();

const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const service = require('../services/catways');
const { checkJWT, isAdmin, isClient, isAdminOrClient } = require('../middlewares/private');

//Route pour la vue catways.ejs
router.get('/', (req, res, next) => {
    console.log("Route GET/catways appelée");
res.render('catways');
});

//Routes vers la vue reservations.ejs
router.get('/:catwayNumber/reservations', (req, res, next) => {
    res.render('reservations', { catwayNumber: req.params.catwayNumber });
});

router.get('/:catwayNumber/reservations/check-access', checkJWT, isAdminOrClient, (req, res) => {
    res.status(200).json({ message: "Accès autorisé" });
});

//Routes API protégées
router.get('/api', checkJWT, isAdminOrClient, async (req, res) => {
    const catways = await Catway.find().sort({catwayNumber : 1});
    res.status(200).json({catways, role : req.user.role});
  });

router.get('/:catwayNumber', checkJWT, isAdminOrClient, service.getById);
router.post('/', checkJWT, isAdmin, service.add);
router.put('/:catwayNumber', checkJWT, isAdmin, service.updateAll);
router.patch('/:catwayNumber', checkJWT, isAdmin, service.update);
router.delete('/:catwayNumber', checkJWT, isAdmin, service.delete);

module.exports = router;
