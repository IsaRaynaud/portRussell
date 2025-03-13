const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Catway = new Schema({
    catwayNumber: {
        type: Number,
        trim: true,
        required: true,
        unique: true        
    },
    type: {
        type: String,
        enum: ['short', 'long'],
        required: true
    },
    catwayState: {
        type: String,
        required: true
    } 
});