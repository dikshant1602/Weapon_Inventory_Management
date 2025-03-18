import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { WeaponDetail } from "../models/weaponDetalis.models.js";
import { Weapon } from "../models/weapon.models.js";
import mongoose from "mongoose"





const addWeaponDetail = asyncHandler(async (req, res) => {
    const weaponDetails = req.body;

    if (!Array.isArray(weaponDetails) || weaponDetails.length === 0) {
        throw new ApiError(400, "Please provide an array of weapon details");
    }

    const newWeapons = [];
    const errors = [];

    for (const weaponDetail of weaponDetails) {
        const { name, subCategory, category, bulletCount, bullet } = weaponDetail;

        if (!name || !subCategory || !category || !bulletCount || !bullet) {
            errors.push({ weaponDetail, message: "Missing required fields" });
            continue;
        }

        const isExist = await WeaponDetail.findOne({ name });
        if (isExist) {
            errors.push({ weaponDetail, message: `Weapon '${name}' already exists` });
            continue;
        }

        const weapon = new WeaponDetail({
            name,
            category,
            subCategory,
            totalFire : bulletCount,
            typeOfBullet : bullet,
        });

        newWeapons.push(weapon);
    }

    if (newWeapons.length > 0) {
        await WeaponDetail.insertMany(newWeapons);
    }

     errors.push({ message: "Remaining Weapon details added successfully" });

    res.status(201).json(new ApiResponse(201, { added: newWeapons, errors }, "Weapons processed successfully"));
});




const addWeaponUnits = asyncHandler(async (req, res) => {
    const weaponUnits = req.body;

    const  inRoom = req.admin.roomNoAssigned;

    if (!Array.isArray(weaponUnits) || weaponUnits.length === 0) {
        throw new ApiError(400, "Please provide an array of weapon units");
    }

    const newWeapons = [];
    const errors = [];

    for (const weaponUnit of weaponUnits) {
        console.log('Processing weapon unit:', weaponUnit); // Logging each weapon unit

        const { weaponDetailId, serialNumber, manufactureDate } = weaponUnit;

        if (!weaponDetailId || !serialNumber || !manufactureDate ) {
            errors.push({ weaponUnit, error: "Missing required fields" });
            continue;
        }

        if (serialNumber === null || serialNumber === '') {
            errors.push({ weaponUnit, message: "Serial number cannot be null or empty" });
            continue;
        }

        const weapon = await WeaponDetail.findById(weaponDetailId);
        if (!weapon) {
            errors.push({ weaponUnit, message: "Weapon detail not found" });
            continue;
        }

        const existingUnit = await Weapon.findOne({ serialNumber: serialNumber });
        if (existingUnit) {
            errors.push({ weaponUnit, message: `Weapon with serial number '${serialNumber}' already exists` });
            continue;
        }

        const newWeapon = new Weapon({
            weaponDetailId: weaponDetailId,
            serialNumber: serialNumber,
            manufactureDate: manufactureDate,
            status: "available",
            subStatus: "Inventory",
            inRoom: inRoom,
            totalFire :  weapon.totalFire,
        });

        newWeapons.push(newWeapon);
    }

    if (newWeapons.length > 0) {
        await Weapon.insertMany(newWeapons);
    }

    errors.push({ message: "Remaining Weapon units added successfully" });

    res.status(201).json(new ApiResponse(201, { added: newWeapons, errors }, "Weapons processed successfully"));
});


const getWeaponsDetailsforTables = asyncHandler(async (req, res) => {

    const { category, subCategory } = req.params;

    console.log(category, subCategory);

    const  inRoom = req.admin.roomNoAssigned;



    
    const weapons = await WeaponDetail.find({ category: category , subCategory: subCategory }).select(" _id name category subCategory , totalFire typeOfBullet");



    if (weapons.length === 0) {
        throw new ApiError(404, "Weapons not found");
        
    }



    return res.status(200).json(new ApiResponse(200, weapons, "Weapons found successfully"));
})



const getWeaponWithDetailsAdd = asyncHandler(async (req, res) => {

    const { weaponDetailId } = req.params;


    const  inRoom = req.admin.roomNoAssigned;

    const weapon = await Weapon.aggregate([
        {
          $match: { inRoom: inRoom, weaponDetailId: new mongoose.Types.ObjectId(weaponDetailId) }
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
           $unwind : {
               path : "$currentissuanceRecord",
               preserveNullAndEmptyArrays : true
           }
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
            $sort: {
                "_id": -1
            }
        },

          {
            $project: {
                _id: 1,
                weaponName: "$weaponDetail.name",
                weaponType: "$weaponDetail.category",
                weaponSubType : "$weaponDetail.subCategory",
                serialNumber: 1,
                status : 1,
                subStatus : 1,
                totalFire : 1,              
                issuedDate : { $ifNull: [{$dateToString: { format: "%Y-%m-%d", date: "$currentissuanceRecord.issuedDate" } }, "Not Issued"] },
                returnDate : { $ifNull: [{$dateToString: { format: "%Y-%m-%d", date: "$currentissuanceRecord.returnDate" } }, "Not Returned"] },
                signNCO: { $ifNull: ["$currentissuanceRecord.signNCO.status", " Not issued"] },
                signJCO: { $ifNull: ["$currentissuanceRecord.signJCO.status", " Not issued"] },
                signCO: { $ifNull: ["$currentissuanceRecord.signCO.status", " Not issued"] },
                issuedTo: {
                    $map: {
                        input: "$issuedName",
                        as: "issued",
                        in: {
                            name: { $ifNull: ["$$issued.name", " Not"] },
                            armyId: { $ifNull: ["$$issued.armyId", " issued"] },
                        }
                    }
                },
            }
        }

        
    ])

    
    



    

    if (weapon.length === 0) {
        throw new ApiError(404, "Weapon not found");
    }


    return res.status(200).json(new ApiResponse(200, weapon, "Weapon found successfully"));
});



const getWeaponWithDetails = asyncHandler(async (req, res) => {


    const  inRoom = req.admin.roomNoAssigned;

    const weapon = await Weapon.aggregate([
        {
          $match: { inRoom: inRoom }
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
           $unwind : {
               path : "$currentissuanceRecord",
               preserveNullAndEmptyArrays : true
           }
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
            $sort: {
                "_id": -1
            }
        },

          {
            $project: {
                _id: 1,
                weaponName: "$weaponDetail.name",
                weaponType: "$weaponDetail.category",
                weaponSubType : "$weaponDetail.subCategory",
                serialNumber: 1,
                status : 1,
                subStatus : 1,
                totalFire : 1,              
                issuedDate : { $ifNull: [{ $dateToString: { format: "%d-%b-%Y", date: "$currentissuanceRecord.issuedDate" } }, "Not Issued"] },
                returnDate : { $ifNull: [{ $dateToString: { format: "%d-%b-%Y", date: "$currentissuanceRecord.returnDate" } }, "Not Returned"] },
                signNCO: { $ifNull: ["$currentissuanceRecord.signNCO.status", " Not issued"] },
                signJCO: { $ifNull: ["$currentissuanceRecord.signJCO.status", " Not issued"] },
                signCO: { $ifNull: ["$currentissuanceRecord.signCO.status", " Not issued"] },
                issuedTo: {
                    $map: {
                        input: "$issuedName",
                        as: "issued",
                        in: {
                            name: { $ifNull: ["$$issued.name", " Not"] },
                            armyId: { $ifNull: ["$$issued.armyId", " issued"] },
                        }
                    }
                },
            }
        }

        
    ])

    
    



    

    if (weapon.length === 0) {
        throw new ApiError(404, "Weapon not found");
    }

    console.log(weapon);

    return res.status(200).json(new ApiResponse(200, weapon, "Weapon found successfully"));
});



const getWeaponDetailsBySerialNumber = asyncHandler(async (req, res) => {

    const { serialNumber } = req.params;
    const  inRoom = req.admin.roomNoAssigned;

    if (!serialNumber) {
        throw new ApiError(400, "Please provide a serial number");
    }



    const weapon = await Weapon.aggregate([
        {
          $match: { serialNumber: serialNumber , inRoom: inRoom}
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
            $unwind : {
                path : "$currentissuanceRecord",
                preserveNullAndEmptyArrays : true
            }
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
            $lookup: {
                from: "dailyissueds",
                localField: "currentissuanceRecord.daillyIssuance",
                foreignField: "_id",
                as: "dailyIssued"
            }
          },

          
          {
            $sort: {
              "dailyIssued.createdAt": -1
            }
          },


          {
            $project: {
                _id: 1,
                weaponName: "$weaponDetail.name",
                weaponType: "$weaponDetail.category",
                weaponSubType : "$weaponDetail.subCategory",
                typeOfBullet : "$weaponDetail.typeOfBullet",
                inRoom : 1,
                serialNumber: 1,
                status : 1,
                subStatus : 1,
                totalFire : 1,              
                issuedDate : { $ifNull: [{ $dateToString: { format: "%d-%b-%Y", date: "$currentissuanceRecord.issuedDate" } }, null] },
                returnDate : { $ifNull: [{ $dateToString: { format: "%d-%b-%Y", date: "$currentissuanceRecord.returnDate" } }, null] },
                issuedTo: {
                    $map: {
                        input: "$issuedName",
                        as: "issued",
                        in: {
                            name: { $ifNull: ["$$issued.name", ""] },
                            armyId: { $ifNull: ["$$issued.armyId", ""] },
                            rank: { $ifNull: ["$$issued.rank", ""] },
                        }
                    }
                },
                dailyIssued : {
                    $map: {
                        input: "$dailyIssued",
                        as: "issued",
                        in: {
                            outTime: { $ifNull: [{ $dateToString: { format: "%Y-%m-%d %H:%M", date: "$$issued.outTime" } }, ""] },
                            inTime: { $ifNull: [{ $dateToString: { format: "%Y-%m-%d %H:%M", date: "$$issued.inTime" } }, ""] },
                            conditionOnReturn: { $ifNull: ["$$issued.conditionOnReturn", ""] },
                            signNCO: { $ifNull: ["$$issued.signNCO.status", ""] },
                            signJCO: { $ifNull: ["$$issued.signJCO.status", ""] },
                            signCO: { $ifNull: ["$$issued.signCO.status", ""] },
                            purpose: { $ifNull: ["$$issued.purpose", ""] },

                        }
                    }
                }
            }
          }
    ])


    if (weapon.length === 0) {
        throw new ApiError(404, "Weapon not found");
    }

    return res.status(200).json(new ApiResponse(200, weapon, "Weapon found successfully"));
});






export { addWeaponDetail , addWeaponUnits , getWeaponsDetailsforTables, getWeaponWithDetails, getWeaponDetailsBySerialNumber , getWeaponWithDetailsAdd }; 

