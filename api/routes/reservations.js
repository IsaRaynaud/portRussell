const express = require('express');
const router = express.Router({ mergeParams: true });

const Reservation = require('../models/reservation');
const service = require('../services/reservations');
const { checkJWT, isAdmin, isClient, isAdminOrClient } = require('../middlewares/private');

router.use((req, res, next) => {
    req.catwayNumber = parseInt(req.params.catwayNumber);
    console.log("Catway Number extrait :", req.catwayNumber);
    next();
});

//API
router.get('/api', checkJWT, isAdminOrClient, async (req, res) => {
    const catwayNumber = req.catwayNumber;
  
    try {
      const reservations = await Reservation.find({ catwayNumber }).sort({ checkIn: 1 });
      
      if (!reservations || reservations.length === 0) {
        res.status(200).json({
            reservations: [],
            role: req.user?.role || "client",
            clientName: req.user?.clientName || null,
            empty: true
        });
      } else {
      res.status(200).json({
        reservations,
        role: req.user?.role || "client",
        clientName: req.user?.clientName || null,
        empty: false
        });
      }

    } catch (err) {
        console.error("Erreur lors du fectch : ", err);
      res.status(500).json({ message: "Erreur chargement des réservations", error: err.message });
    }
  });

router.get('/', service.get);
router.get('/:idReservation', service.getById);
router.post('/', service.add);
router.delete('/:idReservation', service.delete);

module.exports = router;
