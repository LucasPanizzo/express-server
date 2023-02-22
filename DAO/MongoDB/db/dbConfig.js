import mongoose from "mongoose";

const URI ="mongodb+srv://lucaspanizzo99:Panizzo99@coderhouse.3xliklk.mongodb.net/ecommerce?retryWrites=true&w=majority"
 
mongoose.connect(URI,()=>{
    console.log('Successfully connected to the DataBase');
})