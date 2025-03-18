import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { IssuanceRecord } from "../models/issuanceRecord.models.js";
import { Weapon } from "../models/weapon.models.js";
import { CadetDetails } from "../models/cadetDetails.models.js";
import mongoose from "mongoose";

const fetchWeaponsFirst = asyncHandler(async (req, res) => {
  const { serialNo } = req.params;

  const inRoom = req.admin.roomNoAssigned;

  console.log(serialNo);

  if (!serialNo) {
    throw new ApiError(400, "Please provide serialNo");
  }

  const weapon = await Weapon.findOne({ serialNumber: serialNo }).exec();
  if (!weapon) {
    throw new ApiError(401, "Weapon not found");
  }
  if (weapon.status === "issued") {
    throw new ApiError(403, "Weapon is already issued");
  }

  const weaponDetails = await Weapon.aggregate([
    {
        $match: { inRoom: inRoom, _id: new mongoose.Types.ObjectId(weapon._id) }
    },
    {
      $lookup: {
        from: "weapondetails", // Ensure this is the correct collection name
        localField: "weaponDetailId",
        foreignField: "_id",
        as: "weaponDetail",
      },
    },
    {
      $unwind: "$weaponDetail",
    },
    {
      $project: {
        _id: 1,
        weaponName: "$weaponDetail.name",
        weaponType: "$weaponDetail.category",
        weaponSubType: "$weaponDetail.subCategory",
        serialNumber: 1,
      },
    },
  ]).exec();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
       weaponDetails[0], 
        "Weapon details fetched successfully"
      )
    );
});



const soldierDetails = asyncHandler(async (req, res) => {
  const {armyId} = req.params;

  console.log(armyId);

  if (!armyId) {
    throw new ApiError(401, "Army Id not found");
  }
  const soldier = await CadetDetails.findOne({ armyId: armyId }).select(
    "armyId name rank"
  );
  if (!soldier) {
    throw new ApiError(401, "Soldier not found");
  }

  console.log(soldier);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        soldier,
        "Weapon details fetched successfully"
      )
    );
});


const addIssuedRecord = asyncHandler(async (req, res) => {
  const { cadetDetails, weaponId, signNCO, signJCO, signCO } = req.body;
  const roomNoAssigned = req.admin.roomNoAssigned;

  if (!cadetDetails || !weaponId || !signNCO || !signJCO || !signCO) {
    throw new ApiError(400, "Please provide all required details");
  }

  const soldierIds = [];
  const errors = [];

  for (const soldierDetail of cadetDetails) {
    


    const { name, armyNo, rank } = soldierDetail;

    if (!name || !armyNo   || !rank) {
      errors.push({ soldierDetail, error: "Missing required fields" });
      continue;
    }

    try {
      let soldier = await CadetDetails.findOne({ armyId : armyNo });
      if (soldier) {
        soldierIds.push(soldier._id);
      } else {
        soldier = await CadetDetails.create({ name, armyId : armyNo, rank });
        soldierIds.push(soldier._id);
      }
    } catch (err) {
      console.error(`Error processing soldier details for armyId ${armyNo}:`, err);
      errors.push({ soldierDetail, error: `Error processing soldier details: ${err.message}` });
    }

   
    
  }


  if (signNCO.status === "pending") {
    throw new ApiError(400, "NCO signature is pending");
  }

  const createIssueRecord = await IssuanceRecord.create({
    weaponId: weaponId,
    issuedTo: soldierIds,
    issuedDate: new Date(),
    issuedBy: roomNoAssigned,
    signNCO: signNCO,
    signJCO: signJCO,
    signCO: signCO
  });

  if (!createIssueRecord) {
    throw new ApiError(500, "Issue record not created");
  }

  
  const weapon = await Weapon.findByIdAndUpdate(
    { _id: weaponId },
    {
     
      status: "issued"
    }
  );

weapon.isusanceRecordHistory.push(createIssueRecord._id);

weapon.currentissuanceRecordId = createIssueRecord._id;

await weapon.save();

  


  if (!weapon) {
    throw new ApiError(404, "Weapon not found");
  }


  res.status(200).json(
    new ApiResponse(
      200,
      { createIssueRecord },
      "Issue record created successfully",
      { errors }
    )
  );
});



const retundWeapon = asyncHandler(async (req, res) => {
  const { weaponId } = req.body;

  


  if (!weaponId) {
    throw new ApiError(400, "Please provide all required details");
  }

  const weapon = await Weapon.findById(weaponId);

  if (!weapon) {
    throw new ApiError(404, "Weapon not found");
  }

  if (weapon.status !== "issued") {
    throw new ApiError(400, "Weapon is not issued");
  }

  weapon.status = "available";

  const issuedRecord = await IssuanceRecord.findById(weapon.currentissuanceRecordId);

  if (!issuedRecord) {
    throw new ApiError(401, "Issuance record not found");
  }

  issuedRecord.returnDate = new Date();

  weapon.currentissuanceRecordId = null;

  await weapon.save();
  await issuedRecord.save();




  res.status(200).json( new ApiResponse(200, weapon, "Weapon returned successfully"));

});





const createSoldier = asyncHandler(async (req, res) => {
  const { name, armyId, rank } = req.body;

  if (!name || !armyId || !rank) {
    throw new ApiError(400, "Please provide all required details");
  }

  const soldier = await CadetDetails.create({ name, armyId, rank });
  if (!soldier) {
    throw new ApiError(500, "Soldier not created");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { soldier },
        "Soldier created successfully"
      )
    );
});





const approveCOJCOOneTime = asyncHandler(async (req, res) =>  {
  const { sign , recordIDs , role } = req.body;

  if (!sign || !recordIDs || !role) {
      throw new ApiError(400, "Missing required fields");
  }

  if (recordIDs.length === 0) {
     throw new ApiError(401, "Please provide atleast one record");
  }
 
  if(role !== "CO" && role !== "JCO") {
     throw new ApiError(402, "Please provide valid role");
  }


 const updateOps = {};
 if (role === "CO") {
     updateOps.signCO = sign;
 } else if (role === "JCO") {
     updateOps.signJCO = sign;
 }

 await IssuanceRecord.updateMany({ _id: { $in: recordIDs }}, { $set: updateOps });


 return res.status(200).json(new ApiResponse(200, null, "Record approved successfully"));
})









export {
  fetchWeaponsFirst,
  soldierDetails,
  addIssuedRecord,
  createSoldier,
  approveCOJCOOneTime,
  retundWeapon,
}