const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gymSchema = Schema({
    name: String,
    description: String,
    location: String,
    postcode: String,
    memberships: [
        {
            membershipName: String,
            price: Number
        }
    ],
    image: String,
});

const Gym = mongoose.model('Gym', gymSchema);

module.exports = Gym;