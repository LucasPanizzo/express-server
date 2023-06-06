import mongoose from "mongoose";
import config from "../src/config.js";
import logger from "../src/winston.js";

const URI = config.URLMONGO
mongoose.connect(URI,()=>{
    logger.info('Successfully connected to the DataBase',URI);
})