const mongoose = require("mongoose");
require("dotenv").config();

 const dbConnect = ()=>{
   mongoose.connect(process.env.DATABASE_URL)
   .then(()=>{
      console.log("DataBase connected Successfully");
   })
   .catch((e : String)=>{
      console.log("Error occured in DataBase Connection Process.");
      console.log(e);
      process.exit(1);
   })
}


export default dbConnect;