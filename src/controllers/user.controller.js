import {asyncHandler} from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
const registerUser=asyncHandler(async(req,res)=>{

    //get user details
    //validation -not  empty 
    //check user already exists using email and username
    //check for images and avatars
    //upload them to cloudinary
    //create user object - create entry in db
    //remove password and referesh token field from response
    //check for user creation
    //return res


    const {fullName,email,username,password}=req.body
    console.log("email",email,username,password);
    if([fullName,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"ALL FIELDS ARE EMPTY");
    }
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email and username")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath =req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is Required");
    }
   const avatar= await uploadCloudinary(avatarLocalPath);
   const CoverImage=await uploadCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"Avatar File is Required");
   }
   username.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })
  const createdUser=   await User.findById(user._id).select(
    "-password -refreshToken" 
  )
  if(!createdUser){
    throw new ApiError(500,"Something Went wrong While registering user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )

});




export {
    registerUser,
};