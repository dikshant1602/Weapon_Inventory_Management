// issuedSerialNo //issued to 
// find weapon then cuderent issuense and find solger id
// check wepon validation and  user validation // also check sub status
// create dally record  and provide issuderecordId and parpose
// add new dally recordId in issuderrecoid array[]
// change in sub Status in wapane


import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Weapon } from "../models/weapon.models.js";
import { IssuanceRecord } from "../models/issuanceRecord.models.js";
import { DailyIssued } from "../models/dailyIssued.models.js";
import { DamageWeapon } from "../models/DamageWeapon.models.js";
import mongoose from "mongoose";



const fetchWeapons = asyncHandler(async (req, res) => {
    
    const { serialNumber } = req.params;

    const  inRoom = req.admin.roomNoAssigned;


    if (!serialNumber) {
        throw new ApiError(400, "Please provide serialNo");
    }


    const weapon = await Weapon.findOne({ serialNumber: serialNumber });
    if (!weapon) {
        throw new ApiError(401, "Weapon not found");
    }


    if (weapon.status !== "issued") {
        throw new ApiError(403, "Weapon is not issued");
    }

    if (weapon.subStatus !== "Inventory") {
        throw new ApiError(405, "Weapon is not in inventory status");
    }

    
    const weaponDetails = await Weapon.aggregate([
        {
            $match: { inRoom: inRoom, _id: new mongoose.Types.ObjectId(weapon._id) }
        },
        {
            $lookup: {
                from: "weapondetails",
                localField: "weaponDetailId",
                foreignField: "_id",
                as: "weaponDetail"
            }
        },
        {
            $unwind: "$weaponDetail"
        },
        {
            $lookup: {
                from: "issuancerecords",
                localField: "currentissuanceRecordId",
                foreignField: "_id",
                as: "currentissuanceRecord"
            }
        },
        {
            $unwind: "$currentissuanceRecord"
        },
        {
            $lookup: {
                from: "cadetdetails",
                localField: "currentissuanceRecord.issuedTo",
                foreignField: "_id",
                as: "issuedName"
            }
        },
       
        {
            $project: {
                _id: 1,
                weaponName: "$weaponDetail.name",
                weaponType: "$weaponDetail.category",
                weaponSubType: "$weaponDetail.subCategory",
                serialNumber: 1,
                issuedTo: {
                    $map: {
                        input: "$issuedName",
                        as: "issued",
                        in: {
                            name: { $ifNull: ["$$issued.name", ""] },
                            armyId: { $ifNull: ["$$issued.armyId", ""] },
                            armyId1: { $ifNull: ["$$issued.rankdd", ""] },
                            verify: { $ifNull: ["$$issued.verify", false] }
                        }
                    }
                },
            }
        }
    ])
    .exec();
  
    res.status(200).json(new ApiResponse(200, weaponDetails[0], "Weapon details fetched successfully"));


})





const addDailyIssued = asyncHandler(async (req, res) => {
    const { serialNumber, issuedTo, purpose, signCO, signNCO, signJOC } = req.body;

    const  inRoom = req.admin.roomNoAssigned;


    if (!serialNumber || !purpose ) {
        throw new ApiError(400, "Please provide all required fields");
    }

    if (signNCO.status === "pending" ) {
        throw new ApiError(401, "Please provide valid approval by signCNO and signJOC");
    }

    const weapon = await Weapon.findOne({ serialNumber: serialNumber  });
    if (!weapon) {
        throw new ApiError(402, "Weapon not found");
    }

    if (weapon.status !== "issued") {
        throw new ApiError(403, "Weapon is not issued");
    }

    if (weapon.subStatus !== "Inventory") {
        throw new ApiError(405, "Weapon is not in inventory status");
    }

    const issuedRecord = await IssuanceRecord.findById(weapon.currentissuanceRecordId);
    if (!issuedRecord) {
        throw new ApiError(406, "Issuance record not found");
    }

    if (purpose !== "Cleaning") {
       
        if (!issuedTo) {
            throw new ApiError(407, "Please provide issuedTo");
        }


    if (issuedTo.some(issued => !issued.verified)) {
        throw new ApiError(408, "Please verify all cadet details");

    }

}

const defalutSign = {
    status: "pending",
    signId: null
}

    console.log(issuedRecord);

    const dailyIssued = await DailyIssued.create({
        issuedId: issuedRecord._id,
        outTime: new Date(),
        purpose: purpose,
        signNCO: signNCO,
        signJCO: signJOC || defalutSign,
        signCO: signCO  || defalutSign,
        forRoom : inRoom
    });

    if (!dailyIssued) {
        throw new ApiError(410, "Daily issued record not created");
    }

    weapon.subStatus = purpose;

    issuedRecord.daillyIssuance.push(dailyIssued._id);

    await Promise.all([weapon.save(), issuedRecord.save()]);

    res.status(201).json(new ApiResponse(201, dailyIssued, "Daily issued record created successfully"));
});




const returnDailyIssued = asyncHandler(async (req, res) => {
    const { dailyIssuedId, conditionOnReturn, usedBullet, damageDetails } = req.body;

    const  inRoom = req.admin.roomNoAssigned;


    if (!dailyIssuedId || !conditionOnReturn || usedBullet === undefined) {
        throw new ApiError(400, "Please provide dailyIssuedId, conditionOnReturn, and usedBullet");
    }

    const dailyIssued = await DailyIssued.findById(dailyIssuedId);
    if (!dailyIssued) {
        throw new ApiError(401, "Daily issued record not found");
    }

    const issuedRecord = await IssuanceRecord.findById(dailyIssued.issuedId);
    if (!issuedRecord) {
        throw new ApiError(402, "Issuance record not found");
    }

    const weapon = await Weapon.findById(issuedRecord.weaponId);
    if (!weapon) {
        throw new ApiError(403, "Weapon not found");
    }

    if (weapon.subStatus === "Inventory") {
        throw new ApiError(405, "Weapon is not in inventory status");
    }

    if (weapon.subStatus === "Workshop") {
        throw new ApiError(407, "Weapon is not in workshop status");
        
    }

    
    

    dailyIssued.conditionOnReturn = conditionOnReturn;
    dailyIssued.usedBullet = usedBullet;
    dailyIssued.inTime = new Date();

    weapon.subStatus = "Inventory";
    weapon.totalFire -= usedBullet;

    if (weapon.totalFire < 0 && conditionOnReturn === "Working") {
        throw new ApiError(406, "Total fire cannot be less than zero");
    }

    const defalutSign = {
        status: "pending",
        signId: null
        
    }

    if (conditionOnReturn === "Damaged") {
        if (!damageDetails) {
            throw new ApiError(404, "Please provide damageDetails");
        }

        weapon.status = "damaged";
        weapon.currentissuanceRecordId = null;
        weapon.subStatus = "Workshop";

        const damage = await DamageWeapon.create({
            weaponId: weapon._id,
            forRoom: inRoom,
            damageDate: new Date(),
            damageBy: issuedRecord.issuedTo,
            damageType: damageDetails.damageType,
            ReasonDamage: damageDetails.ReasonDamage,
            signNCO: damageDetails.signNCO || defalutSign,
            signJCO: damageDetails.signJCO || defalutSign, 
            signCO: damageDetails.signCO || defalutSign,
        });

        if (!damage) {
            throw new ApiError(405, "Damage record not created");
        }
    }

    if (conditionOnReturn === "Maintenance") {
       
        weapon.status = "maintenance";
        weapon.subStatus = "Workshop";


        const damage = await DamageWeapon.create({
            weaponId: weapon._id,
            forRoom: inRoom,
            damageDate: new Date(),
            damageBy: issuedRecord.issuedTo,
            damageType: "Maintenance",
            ReasonDamage: " Weapon fireRate Is exceeded",
            signNCO: damageDetails.signNCO || defalutSign,
            signJCO: damageDetails.signJCO || defalutSign, 
            signCO: damageDetails.signCO || defalutSign,
        });

        if (!damage) {
            throw new ApiError(405, "Damage record not created");
        }
    }



    await Promise.all([weapon.save(), issuedRecord.save(), dailyIssued.save()]);

    res.status(201).json(new ApiResponse(201, dailyIssued, "Daily issued record updated successfully"));
});




const fetchdailyRecord = asyncHandler(async (req, res) => {

    const  inRoom = req.admin.roomNoAssigned;

    const issuedRecord = await DailyIssued.aggregate([
        {
            $match: {
                forRoom: inRoom
            }
        },
        {
            $lookup: {
                from: "issuancerecords",
                localField: "issuedId",
                foreignField: "_id",
                as: "issuedRecord"
            }
        },
        {
            $unwind: "$issuedRecord"
        },
        {
            $lookup: {
                from: "weapons",
                localField: "issuedRecord.weaponId",
                foreignField: "_id",
                as: "weapon"
            }
        },
        {
            $unwind: "$weapon"
        },
        {
            $lookup: {
                from: "weapondetails",
                localField: "weapon.weaponDetailId",
                foreignField: "_id",
                as: "weaponDetail"
            }
        },
        {
            $unwind: "$weaponDetail"
        },
       
        {
            $lookup: {
                from: "cadetdetails",
                localField: "issuedRecord.issuedTo",
                foreignField: "_id",
                as: "issuedName"
            }
        },
       
        {
            $sort: {
                "_id": -1
            }
        },

        {
            $project: {
                _id: 1,
                outTime: {
                    $dateToString: {
                        format: "%Y-%m-%d %H:%M",
                        date: "$outTime"
                    }
                },
                inTime: {
                    $dateToString: {
                        format: "%Y-%m-%d %H:%M",
                        date: "$inTime"
                    }
                },

                serialNumber: "$weapon.serialNumber",
                weaponName: "$weaponDetail.name",
                weaponType: "$weaponDetail.category",
                weaponSubType: "$weaponDetail.subCategory",
                conditionOnReturn: 1,
                usedBullet: 1,
                signNCO: { $ifNull: ["$signNCO.status", ""] },
                signJCO: { $ifNull: ["$signJCO.status", ""] },
                signCO: { $ifNull: ["$signCO.status", ""] },
                purpose: 1  ,

                issuedTo: {
                    $map: {
                        input: "$issuedName",
                        as: "issued",
                        in: {
                            name: { $ifNull: ["$$issued.name", ""] },
                            armyId: { $ifNull: ["$$issued.armyId", ""] },
                        }
                    }
                },
                

            }
        }


    ]);
    



    return res.status(200).json(new ApiResponse(200, issuedRecord, "Issuance record fetched successfully"));
 } )  


 const approveCOJCO = asyncHandler(async (req, res) =>  {
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

    await DailyIssued.updateMany({ _id: { $in: recordIDs }}, { $set: updateOps });


    return res.status(200).json(new ApiResponse(200, null, "Record approved successfully"));
 })

export { addDailyIssued , returnDailyIssued , fetchWeapons , fetchdailyRecord , approveCOJCO }

