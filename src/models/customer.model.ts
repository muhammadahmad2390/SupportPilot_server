import mongoose from "mongoose";
import Joi from "joi";

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    tier: {
      type: String,
      required: true,
      enum: ["free", "premium", "vip"],
    },
  },
  {
    timestamps: false,
  },
);

export const Customer = mongoose.model("Customer", customerSchema);
