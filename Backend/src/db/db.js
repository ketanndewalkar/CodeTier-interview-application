import mongoose from "mongoose"

export const mongoDBConnect = async () =>{
    await mongoose.connect(process.env.MONGODB_URI)
}