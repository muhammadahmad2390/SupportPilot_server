import mongoose from "mongoose";
import Joi from "joi";

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    customer_id: {
      type: String,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    created_at: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

export const Order = mongoose.model("Order", orderSchema);
