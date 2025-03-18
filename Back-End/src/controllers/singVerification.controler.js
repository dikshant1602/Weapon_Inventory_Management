import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { SecretKey } from "../models/officerSecretKey.models.js";
import Admin from '../models/admin.model.js'


const createverification = asyncHandler(async (req, res) =>  {

    const { name , forRoom , role ,  password } = req.body;

    if (!name || !forRoom || !role || !password) {
        throw new ApiError(400, "Missing required fields");
    }

    const officerUsername = role + "-" + forRoom ;

    const isExist = await SecretKey.findOne({ officerUsername: officerUsername });
    if (isExist) {
        throw new ApiError(401, "Verification already exists ");
    }

    const create = await SecretKey.create({
        officerName: name,
        officerUsername: officerUsername,
        forRoom: forRoom,
        role: role,
        password: password,
        plainPassword: password
    });


    return res.status(200).json(new ApiResponse(200, create, "Verification created successfully"));

});


const verifySign = asyncHandler(async (req, res) =>  {
    
    const { officerUsername , password  } = req.body;
    const { role } = req.params;

    const forRoom = req.admin.roomNoAssigned;

    if (!officerUsername || !password || !role) {
        throw new ApiError(400, "Missing required fields");
    }

    const isExist = await SecretKey.findOne({ officerUsername: officerUsername });
    if (!isExist) {
        throw new ApiError(401, "officer not found ");
    }

    if (isExist.forRoom !== forRoom) {
        throw new ApiError(402, "not Valid  room");
    }

    if (isExist.role !== role) {
        throw new ApiError(403, "Verification not Valid role"); 
    }

    const isMatch = await isExist.isPasswordCorect(password);
    if (!isMatch) {
        throw new ApiError(405, "Verification not Valid password");  
    }

    const reponse = {
        status : "approved by " + isExist.officerName,
        signId : isExist._id
    }

    return res.status(200).json(new ApiResponse(200, reponse, "Verification approved successfully"));

});


const getRooms = asyncHandler(async (req, res) =>  {

    const Rooms = await Admin.find({}).distinct('roomNoAssigned');

    if (!Rooms) {
        throw new ApiError(401, "Rooms not found ");
    }

    return res.status(200).json(new ApiResponse(200, Rooms, "Rooms found successfully"));

});



const changePasswordSign = asyncHandler(async (req, res) =>  {
    const {  forRoom , role ,  password } = req.body;

    if (!forRoom || !role || !password) {
        throw new ApiError(400, "Missing required fields");
    }

    const officerUsername = role + "-" + forRoom ;

    const isExist = await SecretKey.findOne({ officerUsername: officerUsername });
    if (!isExist) {
        throw new ApiError(401, "Verification not found ");
    }

    isExist.password = password;
    isExist.plainPassword = password;
    await isExist.save();


    return res.status(200).json(new ApiResponse(200, isExist, "Password changed successfully"));

})


const repleceOfficer = asyncHandler(async (req, res) =>  {
    const { name , forRoom , role ,  password } = req.body;

    if (!name || !forRoom || !role || !password) {
        throw new ApiError(400, "Missing required fields");
    }

    const officerUsername = role + "-" + forRoom ;

    const isExist = await SecretKey.findOne({ officerUsername: officerUsername });
    if (!isExist) {
        throw new ApiError(401, "Verification already exists ");
    }

    isExist.officerName = name;
    isExist.password = password;
    isExist.plainPassword = password;
    await isExist.save();


    return res.status(200).json(new ApiResponse(200, isExist, "Password changed successfully"));


})





export { createverification , verifySign  , getRooms , changePasswordSign , repleceOfficer }