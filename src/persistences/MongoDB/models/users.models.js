import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    full_name:{
        type:String
    },
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
    },
    tokenResetPassword: {
        type: String,
        required: false,
    },
    tokenExpiration: {
        type: String,
        required: false,
    },
    documents: {
        type: [
          {
            name: { type: String},
            reference: {type: String}
          }
        ],
        required: false
      },
      lastConnection: {
        type: String,
        required: false,
        default: "Never"
      }
    
});

usersSchema.pre("findOne",function(next){
    this.populate("userCart")
    next()
})

export const usersModels = mongoose.model("users", usersSchema);