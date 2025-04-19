import path from 'path';
import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors'
import nodemailer from 'nodemailer' // Import Nodemailer
import authRoutes from './routes/auth.route.js';
import bookingRoutes from './routes/booking.route.js';
import reviewRoutes from './routes/review.route.js'
import dotenv from 'dotenv' // Load environment variables from .env file
import cookieParser from "cookie-parser";

dotenv.config()
// updated code
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(cors({
    origin: '*', // Replace with your Netlify URL
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware to parse cookies


// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// const reviewSchema = new mongoose.Schema({
//     reviewText: String,
//     reviewAuthor: String,
// })

// const Review = mongoose.model('Review', reviewSchema)


app.use('/api/auth', authRoutes); // use auth routes
app.use('/api/booking', bookingRoutes); // use booking routes
app.use('/api/review', reviewRoutes); // use review routes

// Default route
app.use(express.static(path.join(__dirname, "../Frontend")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// // Handle review submission
// app.post('/submit-review', async (req, res) => {
//     try {
//         const { reviewText, reviewAuthor } = req.body;

//         if (!reviewText || !reviewAuthor) {
//             return res.status(400).send('Review text and author are required');
//         }

//         console.log('Received review:', { reviewText, reviewAuthor });
//         const newReview = new Review({ reviewText, reviewAuthor });
//         newReview.save()
//         // Configure email options
//         const mailOptions = {
//             from: process.env.EMAIL_USER, // Replace with your email
//             to: process.env.EMAIL_USER, // Replace with the recipient email
//             subject: 'New Review Submitted',
//             text: `A new review has been submitted:
//             - Review: "${reviewText}"
//             - Author: ${reviewAuthor}`,
//         };

//         // Send email
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Error sending email:', error);
//                 return res.status(500).send('Error sending email: ' + error.message);
//             }
//             console.log('Email sent:', info.response);
//             res.status(200).send('Review submitted and email sent successfully!');
//         });

//         res.status(200).send("Review submitted and email sent.")
//     } catch (err) {
//         console.error('Error handling review submission:', err);
//         res.status(500).send('Error handling review submission');
//     }
// });

// app.get('/reviews', async (req, res) => {
//     try {
//         const reviews = await Review.find();
//         res.status(200).json(reviews)
//     } catch (error) {
//         console.error('Error fetching reviews:', error);
//         res.status(500).send('Error fetching reviews');
//         console.log(error)
//     }
// })

//Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

