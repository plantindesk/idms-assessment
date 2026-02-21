import { Document } from "mongoose";

export interface IAdmin extends Document {
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
