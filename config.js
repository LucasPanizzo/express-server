import dotenv from 'dotenv'
dotenv.config()

export default{
    PORT: process.env.PORT,
    URLMONGO: process.env.URLMONGO
}