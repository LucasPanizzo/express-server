import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema({
    products:{
        type: Array,
    }
})

export const cartsModels = mongoose.model('Carts',cartsSchema)