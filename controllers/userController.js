import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
export const RegisterUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, email, phone, password, cpassword } = req.body;

    // Check if a user with the same email already exists
    const userExist = await Users.findOne({ email });
    if (userExist) {
      res.status(400).json({
        message: "User Already Exists",
      });
      throw new Error("User Already Exists");
    }

    // Create a new user with the provided data
    const newUser = await Users.create({
      username,
      email,
      phone,
      password,
      cpassword,
    });

    // Respond with the user's details and a token
    if (newUser) {
      res.status(201).json({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone, 
        password: newUser.password,
        cpassword: newUser.cpassword,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  } catch (error) {
    console.log("User Registration Error: ", error);
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find a user with the provided email
    const user = await Users.findOne({ email });

    // Check if the user exists and if the provided password matches
    if (user && (await user.matchPassword(password))) {
      // Respond with the user's details and a token
      res.status(200).json({
        message: "user registerd succesfully",
        user: user,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.log("Login Error: ", error);
  }
};
