const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    catwayNumber: {
        type: Schema.Types.ObjectId,
        ref: 'Catway',
        required: true,       
    },
    clientName: {
        type: String,
        trim: true,
        required: true
    },
    boatName: {
        type: String,
        trim: true,
        required: true
    },
    checkIn: {
        type: Date,
        trim: true,
        required: true
    },
    checkOut: {
        type: Date,
        trim: true,
        required: true
    }
}, {timestamps: true}
);

module.exports = mongoose.model('Reservation', reservationSchema);