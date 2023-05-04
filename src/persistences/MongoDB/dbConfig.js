import mongoose from "mongoose";
import config from "../../config.js";
import logger from "../../winston.js";

const URI = config.URLMONGO
mongoose.connect(URI,()=>{
    logger.info('Successfully connected to the DataBase');
})