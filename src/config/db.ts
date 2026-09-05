import mongoose from "mongoose";

const connect_db = async () => {
  const mongodb_uri = process.env.MONGODB_URI;
  if (mongodb_uri) {
    try {
      await mongoose.connect(mongodb_uri);
      console.log("Connected to mongo db");
    } catch (err) {
      console.log(err);
    }
  }
};

export default connect_db;
