const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Admin, Client } = require('../models/users');

//Callback pour la connexion d'un utilisateur
exports.authenticate = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        console.log("Tentative de connexion avec : ", email);

        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).json({ message : "Identifiants incorrects"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message : "Identifiants incorrects"});
        }

        const token = jwt.sign(
            { user: { id: user.id, role: user.role }},
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        let redirect = '';
        if (user.role === 'admin') {
            redirect = '/users/administrateurs';
        } else if (user.role === 'client') {
            redirect = 'users/tableaudebord';
        }

        return res.status(200).json({ token, redirect, role: user.role });
    } catch (error) {
        console.error("Erreur d'authentification : ", error);
        return res.status(500).json({ message : "Erreur interne du serveur"});
    };
}

//Callback pour afficher la liste de tous les utilisateurs
exports.getAll = async (req, res, next) => {
    try {
        console.log("Modèle User :", User);
        const users = await User.find({}, '-password');

        console.log("Utilisateurs récupérés :", users.length);
        return users;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des utilisateurs: " + error.message);
    };
}

//Callback pour ajouter un utilisateur
exports.add = async (userData) => {
    console.log("Requête reçue pour ajout d'un utilisateur :", userData);

    const { email, password, role, adminName, clientName, boatName } = userData;

    if (!email || !password || !role) {
        throw new Error('Email, mot de passe et rôle sont obligatoires.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === 'admin') {
        newUser = new Admin({ email, password: hashedPassword, adminName });
    } else if (role === 'client') {
        newUser = new Client({ email, password: hashedPassword, clientName, boatName });
    } else {
        throw new Error('Rôle invalide');
    }

    await newUser.save();
    console.log("✅ Utilisateur ajouté :", newUser);

    return newUser;
};

//Callback pour mettre à jour un utilisateur
exports.update = async (id, updateData) => {
    const user = await User.findById(id);
    if (!user) throw new Error("Utilisateur introuvable");

    Object.keys(updateData).forEach(key => {
        if (updateData[key]) user[key] = updateData[key];
    });

    await user.save();
    return user;
};

//Callback pour supprimer un utilisateur
exports.delete = async (id) => {
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new Error("Aucun utilisateur supprimé");
    }
    return { message: "Utilisateur supprimé" };
};