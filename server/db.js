import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      
    });

    // Log the database name and the collections in the database
    console.log(
      `MongoDB connected to ${connection.connection.db.databaseName}`
    );
    const collections = await connection.connection.db
      .listCollections()
      .toArray();
    console.log("Collections:", collections.map(collection => collection.name));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
