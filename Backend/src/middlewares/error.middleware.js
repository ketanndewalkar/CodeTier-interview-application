import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js"

export const errorHandler = (err,req,res,next) =>{
    // Custom Errors
    console.log(err);
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || []
        });
    }

    // Invalid Mongo ObjectId
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}`
        });
    }

    // Validation Errors
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }
} 