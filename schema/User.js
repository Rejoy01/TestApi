import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema for the User
const userSchema = new Schema({
  name: {
    type: String,
    required: true, // Name is required
    trim: true, // Removes extra spaces from the start and end
  },
  address: {
    type: String,
    required: true, // Address is required as a string
    trim: true, // Removes extra spaces from the start and end
  },
  parent: {
    type: String,
    required: true, // Address is required as a string
    trim: true,
  },
  country: {
    type: String,
    trim: true, // Removes extra
  },
  state: {
    type: String,
    trim: true, // Removes extra
  },
  email: {
    type: String,
    trim: true, // Removes extra
  },
  phone: {
    type: String,
    trim: true, // Removes extra
  },
});

// Create the model from the schema
const User = mongoose.model("User", userSchema);

// Export the model
export default mongoose.model("User", userSchema);
