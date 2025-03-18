import mongoose from "mongoose";

const bulletRecordSchema = new mongoose.Schema({ 


    typeName : {
        type: String,
        required: [true, "Please provide typeName"],
        maxlength: 50
    },
 
    addedDate : {
        type: Date,
        default: Date.now
    },


   }, { timestamps: true });



export  const BulletRecord =  mongoose.model("BulletRecord", bulletRecordSchema)