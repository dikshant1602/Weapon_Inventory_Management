import mongoose from "mongoose";


const dailyIssuedSchema = new mongoose.Schema({ 

   

    issuedId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IssuanceRecord",
        required: [true, "Please provide issuedId"]
    },
    
    outTime : {
        type: Date,
        required: [true, "Please provide outTime"]
    },

    inTime : {
        type: Date,
    },


    usedBullet : {
        type: Number,
        default: 0
    },

    purpose : { 
        type: String,
        required: [true, "Please provide purpose"],
        enum: ["Training", "Cleaning", "Firing" , "Out of Station"],
    },

    conditionOnReturn : {
        type: String,
      
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

    
    forRoom : {
        type: String,
        required: [true, "Please provide roomNoAssigned"]
    },
   


} , { timestamps: true });



export const DailyIssued = mongoose.model("DailyIssued", dailyIssuedSchema)