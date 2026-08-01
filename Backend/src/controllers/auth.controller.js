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
  if (!refreshToken) {
    throw new ApiError(401, "RefreshToken Not Found");
  }
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

export const updateProfile = asyncHandler(async (req, res) => {
    const allowedUpdates = [
        "name",
        "username",
        "email",
        "password",
        "timezone",
        "skills",
        "experience",
        "availability",
    ];

    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        throw new ApiError(400, "No update data provided.");
    }

    const invalidFields = Object.keys(updates).filter(
        (field) => !allowedUpdates.includes(field)
    );

    if (invalidFields.length > 0) {
        throw new ApiError(400, `Invalid update fields: ${invalidFields.join(", ")}`);
    }

    if (updates.username !== undefined) {
        if (typeof updates.username !== "string" || updates.username.trim().length < 3) {
            throw new ApiError(400, "Username must be at least 3 characters long.");
        }

        const existingUser = await User.findOne({
            username: updates.username.trim(),
            _id: { $ne: req.user._id },
        });

        if (existingUser) {
            throw new ApiError(409, "Username is already taken.");
        }

        req.user.username = updates.username.trim();
    }

    if (updates.email !== undefined) {
        if (typeof updates.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
            throw new ApiError(400, "Please provide a valid email address.");
        }

        const existingUser = await User.findOne({
            email: updates.email.toLowerCase(),
            _id: { $ne: req.user._id },
        });

        if (existingUser) {
            throw new ApiError(409, "Email is already registered.");
        }

        req.user.email = updates.email.toLowerCase();
    }

    if (updates.password !== undefined) {
        if (typeof updates.password !== "string" || updates.password.trim().length < 6) {
            throw new ApiError(400, "Password must be at least 6 characters long.");
        }
        req.user.password = updates.password;
    }

    if (updates.name !== undefined) {
        req.user.name = updates.name;
    }

    if (updates.timezone !== undefined) {
        req.user.timezone = updates.timezone;
    }

    if (updates.skills !== undefined) {
        if (!Array.isArray(updates.skills)) {
            throw new ApiError(400, "Skills must be an array.");
        }
        req.user.skills = updates.skills;
    }

    if (updates.experience !== undefined) {
        if (typeof updates.experience !== "number" || updates.experience < 0) {
            throw new ApiError(400, "Experience must be a non-negative number.");
        }
        req.user.experience = updates.experience;
    }

    if (updates.availability !== undefined) {
        if (!Array.isArray(updates.availability)) {
            throw new ApiError(400, "Availability must be an array.");
        }
        req.user.availability = updates.availability;
    }

    await req.user.save();

    const updatedUser = await User.findById(req.user._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, "Profile updated successfully.", updatedUser)
    );
});
