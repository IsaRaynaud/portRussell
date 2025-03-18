const Reservation = require('../models/reservation');

//Callback pour afficher la liste des réservations d'un catway
exports.get = async (req, res, next) => {
    console.log("Catway Number extrait :", req.params.catwayNumber);
    console.log("Catway Number reçu :", req.params.catwayNumber);
    const catwayNumber = parseInt(req.params.catwayNumber);

    if (isNaN(catwayNumber)) {
        return res.status(400).json({ message: "Le numéro du catway doit être un nombre valide." });
    }
    
    try {
        const reservations = await Reservation.find({ catwayNumber })

        if (reservations.length === 0) {
            return res.status(404).json({message : "Aucune réservation trouvée pour ce catway"})
        }

        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json({message: "Erreur lors de la récupération des données", error: error.message})
    }
}

//Callback pour afficher une réservation particulière d'un catway
exports.getById = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.catwayNumber);
    const reservationId = req.params.idReservation;

    try {
        let reservation = await Reservation.findOne({ _id: reservationId, catwayNumber });

        if (reservation) {
            return res.status(200).json(reservation);
        }

        return res.status(404).json('La réservation est introuvable.');
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne", error: error.message });
    }
}

//Callback pour ajouter une réservation
exports.add = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.catwayNumber);
    const checkInDate = new Date(req.body.checkIn);
    const checkOutDate = new Date(req.body.checkOut);
    
    const temp = ({
        catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        checkIn: checkInDate,
        checkOut: checkOutDate
    });

    try {
        let reservation = await Reservation.create(temp);

        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
}

//Callback pour supprimer une réservation
exports.delete = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.catwayNumber);
    const reservationId = req.params.idReservation;

    try {
        await Reservation.deleteOne({ _id: reservationId, catwayNumber });

        return res.status(204).json({message: 'Suppression effectuée'});
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
}