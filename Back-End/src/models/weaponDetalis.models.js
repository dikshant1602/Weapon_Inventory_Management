import mongoose from "mongoose";

const weaponDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        maxlength: 50,
        unique: true
        
    },

    
    category: {
        type: String,
        required: [true, "Please provide category"],
        maxlength: 50
    },

    subCategory: {
        type: String,
        required: [true, "Please provide subCategory"],
        maxlength: 50
    },

    typeOfBullet: {
        type: String,
        required: [true, "Please provide typeOfBullet"],
        maxlength: 50
    },

    totalFire : {
        type: Number,
        required : [true, "Please provide TotalFire"],
    }

   

}, { timestamps: true });


export const WeaponDetail = mongoose.model("WeaponDetail", weaponDetailSchema)