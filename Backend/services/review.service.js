import Review from "../models/review.model.js";

export const createReview = (values) => new Review(values).save().then((review) => review.toObject());
export const getAllReviews = () => Review.find();