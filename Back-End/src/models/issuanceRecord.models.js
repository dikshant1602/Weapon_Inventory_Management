import mongoose from "mongoose";

const issuanceRecordSchema = new mongoose.Schema({

    weaponId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Weapon"
    },

    issuedTo : [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SoldierDetails"
    } ],

    issudeBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"    
    },

    issuedDate : {
        type: Date,
        default: Date.now
    },

    returnDate : {
        type: Date,
    },

    conditionOnReturn : {
        type: String,
        enum: ["Working","Not Working"],
    },

    signIndividual : {
        type: String,
        enum: ["approved by all", "pending", "rejected"],
    },

   
    signNCO : {
        status : {
            type: String,
            default : "pending"
            }, 

        signId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SecretKey",
            default : null
            }
    },

    signJCO : {
        status : {
            type: String,
            default : "pending"
            }, 

        signId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SecretKey",
            default : null
            }
    },

    signCO : {
         status : {
            type: String,
            default : "pending"
            }, 

        signId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SecretKey",
            default : null
            }
    },

    daillyIssuance : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyIssued"
    }]

    }, { timestamps: true });


export const IssuanceRecord = mongoose.model("IssuanceRecord", issuanceRecordSchema) 