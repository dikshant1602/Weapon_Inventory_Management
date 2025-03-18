import mongoose from "mongoose";

const weaponCategorySchema = new mongoose.Schema({

    category : {
        type: String,
        required: [true, "Please provide category"],
        unique: true
    },


    subCategory : [
        {
            
                type : String,
                required: [true, "Please provide subCategory"],
            

        },
    ]

}, { timestamps: true });


export const WeaponCategory = mongoose.model("WeaponCategory", weaponCategorySchema)