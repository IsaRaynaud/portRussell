const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catwaySchema = new Schema({
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
}, {timestamps: true}
);

module.exports = mongoose.model('Catway', catwaySchema);