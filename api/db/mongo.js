const mongoose = require('mongoose');

const clientOptions = {
    dbName : 'apinode'
};

exports.initClientDbConnection = async () => {
    try {
        const mongoUri = process.env.URL_MONGO;

        if(!mongoUri) {
            throw new Error("L'URL de connexion à MongoDB est introuvable.")
        }

        await mongoose.connect(mongoUri, clientOptions);
        console.log('Connecté');
    } catch (error) {
        console.log('Erreur de MongoDB :', error);
        throw error;
    }
};