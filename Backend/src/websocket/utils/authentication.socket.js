import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";
export const auth = async (socket,request) => {
  const url = new URL(request.url, "http://localhost");
  const token = url.searchParams.get("token");
  if (!token) {
    socket.close(1008, "Unauthorized");

    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    socket.user = user;
  } catch {
    socket.close(1008, "Invalid token");
  }
};
