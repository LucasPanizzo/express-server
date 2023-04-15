import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required:true   
    },
    last_name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },  
    age:{
        type:Number
    },
    rol:{
        type:String,
        default:"user"
    },
    userCart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    }
});

usersSchema.pre("findOne",function(next){
    this.populate("userCart")
    next()
})

export const usersModels = mongoose.model("users", usersSchema);