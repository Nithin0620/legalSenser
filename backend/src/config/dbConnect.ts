const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
   const uri = process.env.DATABASE_URL;
   // console.log("mongoose uri is :",uri)
   if (!uri) {
      console.error("Missing DATABASE_URL in environment. Please add DATABASE_URL to your .env file.");
      console.error("Example: DATABASE_URL='mongodb://localhost:27017/your-db-name'");
      process.exit(1);
   }

   mongoose
      .connect(uri)
      .then(() => {
         console.log("DataBase connected Successfully");
      })
      .catch((e: Error) => {
         console.error("Error occured in DataBase Connection Process.");
         console.error(e);
         process.exit(1);
      });
};

export default dbConnect;