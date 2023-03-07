import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema({
    products:[
        {quantity:{
            type:Number,
            default:1
        }},
        {product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'products',
            default: []
        }}
    ]
})

cartsSchema.pre('find',function(next){
    console.log('llega al pre');
    this.populate('products')
    next()
})

export const cartsModels = mongoose.model('carts',cartsSchema)