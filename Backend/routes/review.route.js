import express from 'express';
import { submitReview, getReviews } from '../controllers/review.controller.js';

import { isAuth, isAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/submit", isAuth, submitReview);
router.get("/", getReviews);

export default router;