import Booking from '../models/booking.model.js'

export const createBooking = (values) => new Booking(values).save().then(booking => booking.toObject());
export const getAllBookings = () => Booking.find();
