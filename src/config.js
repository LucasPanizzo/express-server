import dotenv from 'dotenv'
dotenv.config()

export default{
    PORT: process.env.PORT,
    URLMONGO: process.env.URLMONGO,
    ADMINMAIL: process.env.ADMINMAIL,
    ADMINPASSWORD: process.env.ADMINPASSWORD,
    PERSISTENCES: [process.env.MONGOPERSISTENCE,process.env.FSPERSISTENCE],
    ENV: process.env.ENV
}