import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("Database URI:", process.env.DataBase);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DataBase, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connection successful");
  } catch (err) {
    console.error(err);
  }
};

export default connectToDatabase;
