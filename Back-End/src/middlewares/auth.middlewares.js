import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const jwtVerifyAdmin = asyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
  
      if (!token) {
        throw new ApiError(401, "Not authorized");
      }
  
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const admin = await Admin.findById(decoded?._id).select("-password -__v -refreshToken");
  
      if (!admin) {
        throw new ApiError(401, "Not authorized");
      }
  
      req.admin = admin;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
    }
  });

export const jwtVerifySuperAdmin = asyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
  
      if (!token) {
        throw new ApiError(401, "Access token not found");
      }
  
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const admin = await Admin.findById(decoded?._id).select("-password -__v -refreshToken");
  
      if (!admin) {
        throw new ApiError(402, "Access token not found");
      }
  
      if (!admin.isSuperAdmin) {
        throw new ApiError(401, "Not authorized");
      }
  
      req.admin = admin;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
    }
  });








