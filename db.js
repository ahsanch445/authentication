const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://ach374392:CFK2y2glTBITQTwK@ac-xnxo58f-shard-00-00.v83uw1i.mongodb.net:27017,ac-xnxo58f-shard-00-01.v83uw1i.mongodb.net:27017,ac-xnxo58f-shard-00-02.v83uw1i.mongodb.net:27017/?ssl=true&replicaSet=atlas-7ih05f-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ecommerce"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
