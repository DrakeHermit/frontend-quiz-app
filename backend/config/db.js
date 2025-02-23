import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    const conn = await mongoose.connect(uri, {
      dbName: "frontend-quiz",
    });
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
