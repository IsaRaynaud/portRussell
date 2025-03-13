const Catway = require('../models/catway');

//Callback pour afficher la liste des catways
exports.get = async (req, res, next) => {
    //à rédiger
}

//Callback pour afficher un catway particulier
exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let catway = await Catway.findById(id);

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json('Le catway est introuvable.');
    } catch (error) {
        return res.status(501).json(error);
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
        return res.status(501).json(error);
    }
}

//Callback pour modifier un catway
exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState
    });

    try {
        let catway = await Catway.findOne({_id : id});

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
        return res.status(501).json(error);
    }
}

//Callback pour supprimer un catway
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        await Catway.deleteOne({_id : id});

        return res.status(204).json('Suppression effectuée');
    } catch (error) {
        return res.status(501).json(error);
    }
}