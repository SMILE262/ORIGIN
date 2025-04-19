
import { getUserById } from '../services/user.service.js'
import { createBooking, getAllBookings } from '../services/booking.service.js';
import nodemailer from 'nodemailer';

import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file")
}

// configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})


export const create = async (req, res) => {
    try {
        const { service, notes } = req.body;
        const token = req.cookies.token;
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

        const booking = await createBooking({
            name: user.name,
            age: user.age,
            gender: user.gender,
            location: user.location,
            email: user.email,
            service: service,
            notes: notes || "no"
        })
        if (!booking) {
            return res.status(500).json({ message: "Internal server error" })
        }
        console.log(booking)
        // send email to admin email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Booking!',
            text: `A new user submitted a new booking!
            - Name: ${user.name}
            - Age: ${user.age}
            - Gender: ${user.gender}
            - Location: ${user.location}
            - Email: ${user.email}
            - Service: ${service}
            - Notes: ${notes}
            - Created at: ${booking.createdAt}`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email: ' + error.message);
            }
            console.log('Email sent:', info.response);
            // res.status(200).send('Data saved successfully and email sent!');
        })
        res.status(201).json({ message: "Booking created successfully, sent email to admin.", booking })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const get = async (req, res) => {
    try {
        const bookings = await getAllBookings();
        if (!bookings) {
            return res.status(500).json({ message: "No booking found." })
        }
        res.status(200).json({ message: "Bookings fetched successfully", bookings })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}