import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import type { IAdmin } from "../types/admin.types";
import { EMAIL_REGEX } from "../constants";

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must not exceed 30 characters"],
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(value: string): boolean {
          return EMAIL_REGEX.test(value);
        },
        message: "Please provide a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Index for fast lookups ───
AdminSchema.index({ email: 1 });

// ─── Pre-save hook: hash password before persisting ───
AdminSchema.pre<IAdmin>("save", async function() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
