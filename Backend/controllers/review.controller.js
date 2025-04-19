import { getUserById } from "../services/user.service.js";
import { createReview, getAllReviews } from "../services/review.service.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file.")
}

// configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

export const submitReview = async (req, res) => {
    try {
        const { reviewText } = req.body;
        if (!reviewText) {
            return res.status(400).json({ message: "Review text is required." })
        }
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await getUserById(decoded.id).select("-password")
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const review = await createReview({
            reviewText: reviewText,
            reviewAuthor: user.name,
        });

        if (!review) {
            return res.status(500).json({ message: "Internal server error" })
        }
        // send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Review submitted!",
            text: `An user submitted a new review!
            - Review: ${reviewText}
            - Author: ${user.name}`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email: ' + error.message);
            }
            console.log('Email sent:', info.response);
            // res.status(200).send('Review submitted and email sent successfully!');
        });

        res.status(200).send("Review submitted and email sent.", review)
    } catch (error) {
        console.error('Error submitting review submission:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getReviews = async (req, res) => {
    try {
        const reviews = await getAllReviews();
        if (!reviews) {
            return res.status(404).json({ message: "Reviews not found." })
        }
        res.status(200).json({ message: "Reviews fetched successfully.", reviews })
    } catch (error) {
        console.error('Error fetching reviews: ', error);
        res.status(500).json({ message: "Internal server error." });
    }
}