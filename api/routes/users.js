const express = require('express');
const router = express.Router();

const service = require('../services/users');
const { checkJWT, isAdmin, isClient } = require('../middlewares/private');


router.post('/login', service.authenticate);

//Accès au tableau de bord admin
router.get('/administrateurs', (req, res, next) => {
    res.render('admin');
});
router.get('/admin-data', checkJWT, isAdmin, (req, res, next) => {
    res.json({ message: "Bienvenue dans votre tableau de bord administrateur"});
});

//Accès au tableau de bord client
router.get('/tableaudebord', (req, res, next) => {
    res.render('tableaudebord');
});

router.get('/client-data', checkJWT, isClient, (req, res, next) => {
    res.json({message : "Bienvenue dans votre tableau de bord !"});
});

//Routes pour la gestion des utilisateurs
//Liste
router.get('/', async (req, res, next) => {

    try {
        const users = await service.getAll();
        res.render('users', {users: users});
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).send("Erreur serveur");
    }
});

//Ajout
router.post('/', async (req, res) => {

    const { email, password, role, adminName, clientName, boatName } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email manquant" });
    }

    const isApi = req.headers.accept?.includes("application/json");

    try {
        const newUser = await service.add(req.body);

        if (isApi) {
            return res.status(201).json({
                message: "Utilisateur ajouté avec succès",
                user: newUser
            });
        } else {
            return res.redirect('/users');
        }

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);

        if (isApi) {
            return res.status(500).json({ message: "Erreur serveur", error });
        } else {
            return res.status(500).send("Erreur lors de l'ajout de l'utilisateur");
        }
    }
});

//Mise à jour
router.patch('/:id', async (req, res) => {
    try {
        const updatedUser = await service.update(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ message: error.message });
    }
});

//Suppression
router.delete('/:id', async (req, res) => {
    try {
        const result = await service.delete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;