import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { refreshTokenOptions } from "../utils/cookieOptions.js";

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TIMEOUT }
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TIMEOUT }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const resData = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .status(200)
        .json(
            new ApiResponse(200, "User logged in successfully.", {
                user: resData,
                accessToken,
            })
        );
});
export const signUp = asyncHandler(async (req, res) => {
    
  console.log("hello") ;
  const { username, name, email, password, role } = req.body;

    // Validate input
    if (!username || !name || !email || !password) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (existingUser) {
        if (existingUser.username === username) {
            throw new ApiError(409, "Username is already taken.");
        }

        throw new ApiError(409, "Email is already registered.");
    }

    // Create user
    const user = await User.create({
        username,
        name,
        email,
        password,
        role // Optional if your schema has a default
    });

    // Fetch user without password
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully.",
            createdUser
        )
    );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken)
  if (!refreshToken) {
    throw new ApiError(401, "RefreshToken Not Found");
  }
  console.log(process.env.JWT_REFRESH_SECRET);
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET||"asndjandkjasj");
  if (!payload) {
    throw new ApiError(401,"Invalid refreshToken");
  }
  
  const ExistUser = await User.findById(payload._id).select("-password");

  if(ExistUser.refreshToken != refreshToken){
    throw new ApiError(401,"Wrong refreshToken");
  }
  const newRefreshToken = jwt.sign({
    _id:ExistUser._id
  },process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.JWT_REFRESH_TIMEOUT})
  const newAccessToken = jwt.sign({
    _id:ExistUser._id
  },process.env.JWT_TOKEN_SECRET,{expiresIn:process.env.JWT_TIMEOUT})

  ExistUser.refreshToken = newRefreshToken;
  await ExistUser.save();

  return res.status(200,"Session Refreshed",ExistUser)
  
});

export const logOut = asyncHandler(async (req,res) =>{
  
  const user = await User.findById(req.user._id)

  user.refreshToken=null;
  await user.save();

  res.clearCookie("refreshToken").status(200).json(new ApiResponse(200,"User Logged Out"))
})

export const getMe = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id);
  if(!user){
    throw new ApiError(500,"Server Error");
  }
  user.password = null;
  user.refreshToken = null;
  res.status(200).json(new ApiResponse(200,"Profile Fetched Successfully",user));
})
