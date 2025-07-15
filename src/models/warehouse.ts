import mongoose, { Document, Schema } from 'mongoose';

import { Warehouse } from "../types/types";

const warehouseSchema = new Schema<Warehouse>(
  {
    warehouseName: {
      type: String,
      required: true,
      trim: true,
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
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

warehouseSchema.index({ location: '2dsphere' });

export default mongoose.model<Warehouse>('Warehouse', warehouseSchema);
