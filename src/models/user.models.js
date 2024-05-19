import mongoose,{Schema, schema} from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema =new Schema({


    username:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type: String,
        required: true,
        trim:true,
        index:true,
    },
    avatar:{
        type: String,
        required:true,

    },
    coverImage:{
        type: String,
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true,'Password is Required']
    },
    refreshToken:{
        type:String,
    },
    

},
{ 
    timestamps:true,
    },
)

userSchema.pre("save",async function(next){
   if(!this.isModified("password"))return next();
    this.password= await bcrypt.hash(this.password,10);
    next()
})


userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(this.password,password)
}
userSchema.methods.generateAccessToken =function(){
    jwt.sign({
        _id:this.id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIN:process.env.ACCESS_TOKEN_EXIPRY
    }
)

}
userSchema.methods.generaterefreshToken =function(){
    jwt.sign({
        _id:this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIN:process.env.REFRESH_TOKEN_EXIPRY
    })
}

export const User = mongoose.model("User",userSchema)