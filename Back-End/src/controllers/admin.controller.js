import Admin from '../models/admin.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Weapon } from "../models/weapon.models.js";
import mongoose from 'mongoose';
import { WeaponCategory } from '../models/weaponCategory.models.js';

    

    const genarateToken = async (adminid) => {

        try {
    
            const admin = await Admin.findById(adminid);
    
            const accessToken = admin.generateAccessToken();
            const refreshToken = admin.generateRefreshToken();
    
            admin.refreshToken = refreshToken;
    
            await admin.save({ validateBeforeSave: false });
    
            return { accessToken, refreshToken }
    
    
        } catch (error) {
            throw new ApiError(500, error?.message, "Something went wrong");
        }
    
    }
    
    
    
    
    const registerAdmin = asyncHandler(async (req, res) => {
    
        const { adminName, roomNoAssigned, password } = req.body;
    
        if (!adminName || !roomNoAssigned || !password ) {
            throw new ApiError(400, "Please provide all values");
        }
    
        const admin = await Admin.create({ adminName , roomNoAssigned, password  });
    
        if (!admin) {
            throw new ApiError(400, "Admin already exists");
        }
    
       return res.status(200).json(new ApiResponse(201, "Admin created successfully", admin));
     });

     const signInAdmin = asyncHandler(async (req, res) => {
        const { roomNoAssigned, password } = req.body;
        if (!roomNoAssigned || !password) {
          throw new ApiError(400, "Please provide all values");
        }
        const admin = await Admin.findOne({roomNoAssigned});
        if (!admin) {
          throw new ApiError(401, "user not found");
        }
      
        const isMatch = await admin.isPasswordCorect(password);
        if (!isMatch) {
          throw new ApiError(402, "password not match");
        }
      
        const { accessToken, refreshToken } = await genarateToken(admin._id);
      
        const logedAdmin = await  Admin.findById(admin._id).select(
          "-password -refreshToken -__v -createdAt -updatedAt"
        );
      
        const options = {
          httpOnlly: true,
          secure: true,
        };
      
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(
              200,
              { logedAdmin, accessToken, refreshToken },
              "login successfuly"
            )
          );
      });

      const signOutAdmin = asyncHandler(async (req, res) => {
        const logout = await Admin.findOneAndUpdate(
          { _id: req.admin._id },
          { refreshToken: "" },
          { new: true }
        );
      
        if (!logout) {
          throw new ApiError(401, "user not found");
        }
      
        const option = {
          httpOnly: true,
          secure: true,
        };
      
        return res
          .status(200)
          .clearCookie("accessToken", option)
          .clearCookie("refreshToken", option)
          .json(new ApiResponse(200, "logout successfuly"));
      });
      

      const fatchData = asyncHandler(async (req, res, next) => {
        const admin = req.admin._id;

        console.log(admin);

        const logedAdmin = await  Admin.findById(admin._id).select(
          "-password -refreshToken -__v -createdAt -updatedAt"
        );

        if (!logedAdmin) {
           throw new ApiError(401, "user not found");
        }


        const { accessToken, refreshToken } = await genarateToken(logedAdmin._id);

      
        const options = {
          httpOnlly: true,
          secure: true,
        };
      
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(
              200,
              { logedAdmin, accessToken, refreshToken },
              "login successfuly"
            )
          );

       
      });
    


      const fetchRoomIncharge = asyncHandler(async (req, res) => {
        
        const  incharge = await Admin.find({}).select("_id adminName adminRole roomNoAssigned password");
        
        return res.status(200).json(new ApiResponse(200, incharge, "incharge found successfully"));

      });


      const changePassword = asyncHandler(async (req, res) => {

        const { newPassword , roomNoAssigned } = req.body;

        console.log(newPassword, roomNoAssigned);

        if (!newPassword || !roomNoAssigned) {
          throw new ApiError(400, "Please provide all values");
        }
    
        const admin = await Admin.findOne({roomNoAssigned});
        if (!admin) {
          throw new ApiError(401, "user not found");
        }
    
        admin.password = newPassword;
    
        const updatedAdmin = await admin.save();
    
        return res.status(200).json(new ApiResponse(200, updatedAdmin, "password changed successfully"));

       })

       const superLogin = asyncHandler(async (req, res) => {
        const { roomNoAssigned } = req.params;
        if (!roomNoAssigned) {
          throw new ApiError(400, "Please provide all values");
        }

        const admin = await Admin.findOne({roomNoAssigned});
        if (!admin) {
          throw new ApiError(401, "user not found");
        }

        const { accessToken, refreshToken } = await genarateToken(admin._id);

        const logedAdmin = await  Admin.findById(admin._id).select(
          "-password -refreshToken -__v -createdAt -updatedAt"
        );


        const options = {
          httpOnlly: true,
          secure: true,
        };

        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(
              200,
              { logedAdmin, accessToken, refreshToken },
              "login successfuly"
            )
          );
      });


  
    const getDashbord = asyncHandler(async (req, res) => {
        const admin = req.admin.roomNoAssigned;

        console.log(admin);
        const data = await Weapon.aggregate([
          {
            $match: { inRoom: admin }
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: null,
              totalWeapon: { $sum: "$count" },
              weaponStatus: {
                $push: {
                  k: "$_id",
                  v: "$count"
                }
              }
            }
          },
          {
            $addFields: {
              weaponStatus: {
                $arrayToObject: "$weaponStatus"
              }
            }
          },
          {
            $project: {
              _id: 0,
              totalWeapon: 1,
              weaponStatus: 1
            }
          }
        ]);
        
        const formattedData = {
          totalWeapon: data[0].totalWeapon,
          ...data[0].weaponStatus
        };
        
        

        if (!data) {
          throw new ApiError(401, "data not found");
        }



        const result = await WeaponCategory.aggregate([
          {
            $facet: {
              totalCategories: [
                { $count: "count" }
              ],
              totalSubcategories: [
                { $unwind: "$subCategory" },
                { $count: "count" }
              ]
            }
          }
        ]);
      
        formattedData.totalCategories = result[0].totalCategories[0] ? result[0].totalCategories[0].count : 0;
        formattedData.totalSubcategories = result[0].totalSubcategories[0] ? result[0].totalSubcategories[0].count : 0;

      





        return res.status(200).json(new ApiResponse(200, formattedData, "data found successfully"));
    })





      export { getDashbord, registerAdmin, signOutAdmin, signInAdmin , fatchData , fetchRoomIncharge , changePassword , superLogin} ;