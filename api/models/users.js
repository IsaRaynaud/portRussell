const mongoose = require('mongoose');
const options = {discriminatorKey: 'role', timesstamps: true};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, options);

const User = mongoose.model('User', userSchema);

//Héritage pour l'admin
const Admin = User.discriminator('admin', new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    }
}, options));

//Héritage pour le client
const Client = User.discriminator('client', new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientBoat: {
        type: String,
        required: true
    }
}, options));

module.exports = {User, Admin, Client};