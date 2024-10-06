const express = require('express');
const app = express();
const db = require('./db');
const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Define a schema for the visit counter
const visitSchema = new mongoose.Schema({
    visits: { 
        type: Number, 
        default: 0 },
});

// Create a model based on the schema
const Visit = mongoose.model('Visit', visitSchema);

// Function to get the current visit counter or initialize it if not exists
async function getOrCreateVisitCounter() {
    let visitCounter = await Visit.findOne();
    if (!visitCounter) {
        visitCounter = new Visit({ visits: 0 });
        await visitCounter.save();
    }
    return visitCounter;
}

// Route to handle site visits
app.get('/', async (req, res) => {
    try {
        // Get or create the visit counter
        let visitCounter = await getOrCreateVisitCounter();

        // Increment the visit count
        visitCounter.visits += 1;
        await visitCounter.save();

        // Send a response with the current visit count
        res.send(`This site has been visited ${visitCounter.visits} times.`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
