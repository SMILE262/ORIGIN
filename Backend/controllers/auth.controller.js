import { getAllUsers, getUserById, getUserByEmail, createUser, getUserByUsername } from '../services/user.service.js'
// import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt'
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file")
}

export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await getUserById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.userId = user._id;
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await getUserById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        if (user.type !== "admin") {
            return res.status(403).json({ message: "Forbidden" })
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const signup = async (req, res) => {
    try {
        const { name, age, gender, location, email, password } = req.body;
        if (!name || !age || !gender || !location || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({
            name,
            age,
            gender,
            location,
            email,
            password: hashedPassword
        })
        if (!newUser) {
            return res.status(500).json({ message: "Internal server error" })
        }
        res.status(201).json({ message: "User created successfully. Log in to continue" })
    } catch (error) {
        console.error("Error signing up: ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        const user = await getUserByEmail(email)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" })
        res.cookie("token", token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
        })
        res.status(200).json({ message: "Login successfully" })
    } catch (error) {
        console.error("Error logging in: ", error)
        return res.status(500).json({ message: "Internal server error" })
    }

}

export const isLoggedIn = async (req, res) => {
    try {
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

        res.status(200).json({ loggedin: true, message: "User is logged in", user })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        res.clearCookie("token", {
            httpOnly: true,
            path: '/',
        })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}