const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    let token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
    console.log("Requête reçue avec Authorization :", req.headers['authorization']);
    console.log("Requête reçue avec x-access-token :", req.headers['x-access-token']);

    if (token && token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token non valide"});
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } else {
        return res.status(401).json({ message: "Token requis"});
    }
}


//Vériication de la connexion
exports.isAdminOrClient = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'client')) {
        return res.status(403).json({ message: "Identifiants incorrects, contactez le port Russell pour obtenir un accès" });
    }
    next();
};

//Vérification du rôle admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }
    next();
};

//Vérification du rôle client
exports.isClient = (req, res, next) => {
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({ message: "Accès réservé aux clients enregistrés" });
    }
    next();
};
