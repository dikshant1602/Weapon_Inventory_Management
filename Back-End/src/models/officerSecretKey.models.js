import mongoose from "mongoose";
import bcrypt from "bcrypt";

const officerSecretKeySchema = new mongoose.Schema({  
    
    officerName : {
        type: String,
        required: [true, "Please provide officerName"],
        maxlength: 50
    },

    officerUsername : {
        type: String,
        required: [true, "Please provide officerUsername"],
        maxlength: 50
    },

    password : {
        type: String,
        required: [true, "Please provide officerPassword"],
        maxlength: 50
    },

    plainPassword : {
        type: String,
        
    },

    forRoom : {
        type: String,
        required: [true, "Please provide forRoom"],
        maxlength: 50
    },

    role : {
        type: String,
        required: [true, "Please provide post"],
        eunm : ["NCO", "JCO", "CO"],
        maxlength: 50
    }
   
}, { timestamps: true });


  officerSecretKeySchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  officerSecretKeySchema.methods.isPasswordCorect = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };


  export const SecretKey = mongoose.model("SecretKey", officerSecretKeySchema);
  