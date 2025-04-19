import express from 'express';
import { signup, login, isLoggedIn, logout } from '../controllers/auth.controller.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/isloggedin', isLoggedIn);
router.post('/logout', logout);


export default router;