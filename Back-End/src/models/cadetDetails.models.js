import mongoose from "mongoose";


const cadetDetailsSchema = new mongoose.Schema({    

    name : {
        type: String,   
        required: [true, "Please provide name"],
        maxlength: 50
    },

    rank : {    
        type: String,   
        required: [true, "Please provide rank"],
        maxlength: 50
    },

    armyId : {    
        type: String,   
        required: [true, "Please provide armyId"],
        maxlength: 50,
        unique: true
    },

    issuedWeapons : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Weapon"
        }
    ]

   }, { timestamps: true });


export const CadetDetails = mongoose.model("CadetDetails", cadetDetailsSchema)