import mongoose from "mongoose";

import { User } from "../types/types"; // Adjust the import path as necessary

const userSchema = new mongoose.Schema<User>({
    facebookId: {
       type: String, 
    },
    name: {
        type: String,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    accessToken: {
      type: String,
      default: null,
    },
}, { timestamps: true })

export default mongoose.model<User>('user', userSchema)