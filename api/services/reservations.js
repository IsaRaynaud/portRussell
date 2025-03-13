const Reservation = require('../models/reservation');

//Callback pour afficher la liste des réservations
exports.get = async (req, res, next) => {
    try {
        const reservations = await Reservation.find()
        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json({message: "Erreur lors de la récupération des données", error: error.message})
    }
}

//Callback pour afficher une réservation particulière
exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let reservation = await Reservation.findById(id);

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
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        checkIn: req.body.checkIn,
        checkout: req.body.checkOut
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
    const id = req.params.id

    try {
        await Reservation.deleteOne({_id : id});

        return res.status(204).json({message: 'Suppression effectuée'});
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
}