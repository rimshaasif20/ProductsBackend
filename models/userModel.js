import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Define a pre-save hook to hash the password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // If the password has not been modified, skip the hashing process
  }

  const salt = await bcrypt.genSalt(10); // Generate a salt for password hashing
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
});
const Users = mongoose.model("users", userSchema);

export default Users;
