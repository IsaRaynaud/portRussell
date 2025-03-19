const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Admin, Client } = require('../models/users');

//const JWT_SECRET = process.env.JWT_SECRET_KEY;

//Callback pour la connexion d'un utilisateur
exports.authenticate = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email : email});

        if (user) {
            bcrypt.compare(password, user.password, function(err, response) {
                if (err) {
                    throw new Error(err);
                }
                if (response) {
                    delete user._doc.password;

                    const expireIn = 24 * 60 * 60;
                    const token = jwt.sign({
                        user: user
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: expireIn
                    }
                );
                res.header('Authorization', 'Bearer ' + token);

                return res.status(200).json('authentification_reussie');
                }

                return res.status(403).json('echec_authentification');
            });
        } else {
            return res.status(404).json('utilisateur_introuvable');
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}

//Callback pour afficher la liste de tous les utilisateurs
exports.getAll = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message : "Erruer lors de la récupération des données :", error: error.message });
    }
}

//Callback pour trouver un utilisateur
exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('Utilisateur introuvable');
    } catch (error) {
        return res.status(501).json(error);
    }
}

//Callback pour ajouter un utilisateur
exports.add = async (req, res, next) => {
    console.log("Requête reçue pour ajout d'un utilisateur :", req.body);
    const { email, password, role, adminName, clientName, boatName } = req.body;

    try {
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, mot de passe et rôle sont obligatoires.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;

        if (role === 'admin') {
            newUser = new Admin({ email, password: hashedPassword, adminName });
        } else if (role === 'client') {
            newUser = new Client({ email, password: hashedPassword, clientName, boatName });
        } else {
            return res.status(400).json({ message: 'Rôle invalide' });
        }

        await newUser.save();
        res.status(201).json({message: "Le nouvel utilisateur a été créé.", user: newUser});
    } catch (error) {
        res.status(500).json({message: "Erreur lors de la création de l'utilisateur :", error: error.message});
    }
}

//Callback pour mettre à jour un utilisateur
exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        adminName: req.body.adminName,
        clientName: req.body.clientName,
        boatName: req.body.boatName
    });

    try {
        let user = await User.findOne({_id: id});

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);
        }
        return res.status(404).json({ message: "Utilisateur introuvable"});
    } catch (error) {
        return res.status(501).json(error);
    }
}

//Callback pour supprimer un utilisateur
exports.delete = async (req, res, next) => {
    const id = req.params.id;

    try {
        await User.deleteOne({_id: id});

        return res.status(204).json({ message : "L'utilisateur a bien supprimé"});
    } catch (error) {
        return res.status(501).json(error);
    }
}