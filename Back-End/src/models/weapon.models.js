import mongoose from "mongoose";

const weaponSchema = new mongoose.Schema({

    // main details
    weaponDetailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeaponDetail"
    },

   

    serialNumber: {
        type: String, 
        minlength: 3,
        maxlength: 50,
        unique: true
    },

    status: {
        type: String,   
        enum: ["available", "issued", "damaged" , "maintenance" ],
        required: [true, "Please provide status"],
    },

    subStatus: {
        type: String,   
        enum: ["Inventory", "Training" , "Cleaning", "Firing" , "Out of Station"  , "Workshop"],
        required: [true, "Please provide subStatus"],
        default : "Innovatory"
    },

    currentissuanceRecordId :  { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "IssuanceRecord",
        default: null
    },

    isusanceRecordHistory : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "IssuanceRecord"
            }
    ],

   
    totalFire : {
        type: Number,
        default: 0
    },

    inRoom : {
        type: String,
        required: [true, "Please provide inRoom"]
    }

    
}, { timestamps: true });


export const Weapon = mongoose.model("Weapon", weaponSchema);