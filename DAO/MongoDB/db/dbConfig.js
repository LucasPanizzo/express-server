import mongoose from "mongoose";
import config from "../../../config.js";

const URI = config.URLMONGO
mongoose.connect(URI,()=>{
    console.log('Successfully connected to the DataBase');
})