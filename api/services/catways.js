const Catway = require('../models/catway');

//Callback pour afficher la liste des catways
exports.get = async (req, res, next) => {
    try {
        const catways = await Catway.find()
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(500).json({message: "Erreur lors de la récupération des données", error: error.message})
    }
}

//Callback pour afficher un catway particulier
exports.getById = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.catwayNumber);

    try {
        let catway = await Catway.findOne({ catwayNumber: catwayNumber});

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json({ message: 'Le catway est introuvable.'});
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne", error: error.message });
    }
}

//Callback pour ajouter un catway
exports.add = async (req, res, next) => {
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState
    });

    try {
        let catway = await Catway.create(temp);

        return res.status(201).json(catway);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
}

//Callback pour modifier intégralement un catway
exports.updateAll = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.catwayNumber);

    const temp = {};
        if (req.body.catwayNumber !== undefined) temp.catwayNumber = req.body.catwayNumber;
        if (req.body.type !== undefined) temp.type = req.body.type;
        if (req.body.catwayState !== undefined) temp.catwayState = req.body.catwayState;

    try {
        if (Object.keys(temp).length === 0) {
            console.log("Aucune donnée pour la mise à jour.");
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }

        let updatedCatway = await Catway.findByIdAndUpdate(catwayNumber, temp, {new: true, runValidators: true });

        if (!updatedCatway) {
            return res.status(404).json({message: "Catway introuvable"});
        }

        return res.status(200).json(updatedCatway);
    } catch (error) {
        return res.status(500).json({message: "Erreur lors de la mise à jour:", error: error.message});
    }
}

//Callback pour modifier un catway
exports.update = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.catwayNumber);
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState
    });

    try {
        let catway = await Catway.findOne({ catwayNumber : catwayNumber});

        if (catway) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    catway[key] = temp[key];
                }
            });

            await catway.save();
            return res.status(201).json(catway);
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
}

//Callback pour supprimer un catway
exports.delete = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.catwayNumber);

    try {
        await Catway.deleteOne({catwayNumber : catwayNumber});

        return res.status(204).json({message: 'Suppression effectuée'});
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
}