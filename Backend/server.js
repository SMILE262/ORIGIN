const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import Nodemailer
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Replace with your Netlify URL
}));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model
const userSchema = new mongoose.Schema({
    username: String,
    age: Number,
    gender: String,
    email: String,
    location: String,
});

const User = mongoose.model('User', userSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
    auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or app password
    },
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Enlightened Sage API!');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { username, age, gender, email, location } = req.body;

        // Save data to MongoDB
        const newUser = new User({ username, age, gender, email, location });
        await newUser.save();

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER, // Replace with your email
            to: process.env.EMAIL_USER, // Replace with the recipient email
            subject: 'New Form Submission',
            text: `A new form submission has been received:
            - Name: ${username}
            - Age: ${age}
            - Gender: ${gender}
            - Email: ${email}
            - Location: ${location}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email: ' + error.message);
            }
            console.log('Email sent:', info.response);
            res.status(200).send('Data saved successfully and email sent!');
        });

        res.status(200).send('Data saved successfully and email sent!');
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Error saving data');
    }
});

// Handle review submission
app.post('/submit-review', async (req, res) => {
    try {
        const { reviewText, reviewAuthor } = req.body;
        console.log('Received review:', { reviewText, reviewAuthor }); 
        
        if (!reviewText || !reviewAuthor) {
            return res.status(400).send('Review text and author are required');
        }

        // Configure email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Replace with your email
            to: process.env.EMAIL_USER, // Replace with the recipient email
            subject: 'New Review Submitted',
            text: `A new review has been submitted:
            - Review: "${reviewText}"
            - Author: ${reviewAuthor}`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email: ' + error.message);
            }
            console.log('Email sent:', info.response);
            res.status(200).send('Review submitted and email sent successfully!');
        });
    } catch (err) {
        console.error('Error handling review submission:', err);
        res.status(500).send('Error handling review submission');
    }
});

//Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Add this instead:
// module.exports = app;

