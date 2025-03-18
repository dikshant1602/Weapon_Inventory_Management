import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Weapon } from "../models/weapon.models.js";
import { IssuanceRecord } from "../models/issuanceRecord.models.js";
import { DailyIssued } from "../models/dailyIssued.models.js";
import { DamageWeapon } from "../models/DamageWeapon.models.js";
import { WeaponDetail } from "../models/weaponDetalis.models.js";



const fetchDamageWeapon = asyncHandler(async (req, res) => {


    const  inRoom = req.admin.roomNoAssigned;
    
     

    const weapon = await DamageWeapon.aggregate([

        {
            $match: { forRoom: inRoom, }

        },
        
        {
            $lookup: {
                from: "weapons",
                localField: "weaponId",
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
                localField: "damageBy",
                foreignField: "_id",
                as: "damageBy"
            }
        },
        {
            $project: {
                _id: 1,
                weaponName: "$weaponDetail.name",
                weaponType: "$weaponDetail.category",
                weaponSubType: "$weaponDetail.subCategory",
                serialNumber: "$weapon.serialNumber",
                damageDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$damageDate"
                    }
                },
                retundDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$retundDate"
                    }
                },
                damageType: 1,
                ReasonDamage: 1,
                damageBy: {
                    $map: {
                        input: "$damageBy",
                        as: "issued",
                        in: {
                            name: { $ifNull: ["$$issued.name", ""] },
                            armyId: { $ifNull: ["$$issued.armyId", ""] },
                        }
                    }
                },
                signNCO: { $ifNull: ["$signNCO.status", ""] },
                signJCO: { $ifNull: ["$signJCO.status", ""] },
                signCO: { $ifNull: ["$signCO.status", ""] },
            }
        }

        

    ]);


    if (!weapon) {
        throw new ApiError(404, "Weapon not found");
    }


    return res.status(200).json(new ApiResponse(200, weapon, "Weapon found successfully"));

})




const approveCOJCODamage = asyncHandler(async (req, res) =>  {
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

   await DamageWeapon.updateMany({ _id: { $in: recordIDs }}, { $set: updateOps });


   return res.status(200).json(new ApiResponse(200, null, "Record approved successfully"));
})





const MaintenanceComplete = asyncHandler (async (req , res )=> {

    const { recordIDs } = req.params;

    if (!recordIDs) {
        throw new ApiError(400, "Missing required fields");
    }

    const record = await DamageWeapon.findById(recordIDs);

    if (!record) {
        throw new ApiError(404, "Record not found");
    }

    const weapon = await Weapon.findById(record.weaponId);

    if (!weapon) {
        throw new ApiError(404, "Weapon not found");
    }

    const wd = await WeaponDetail.findById(weapon.weaponDetailId);

    if (!wd) {
        throw new ApiError(404, "Weapon detail not found");
    }


    if (weapon.status === "maintenance") {
        weapon.status = "issued";
        
    }else {
        weapon.status = "available";
    }
    
    weapon.totalFire =  wd.totalFire;
    weapon.subStatus = "Inventory";
    
    record.retundDate = new Date();

    await record.save();


    await weapon.save();


    return res.status(200).json(new ApiResponse(200, null, "Record updated successfully"));


    
   
})






export { fetchDamageWeapon  , approveCOJCODamage  , MaintenanceComplete } 