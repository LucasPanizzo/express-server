import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema({
    products:[
        {
            quantity:{
                type:Number,
                default:1
            },
            type: mongoose.Schema.Types.ObjectId,
            ref:'products',
            default: []
        }
    ]
})

cartsSchema.pre('find',function(next){
    this.populate('products')
    next()
})

export const cartsModels = mongoose.model('carts',cartsSchema)