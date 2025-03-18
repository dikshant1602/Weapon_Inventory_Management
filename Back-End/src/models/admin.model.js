import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
      
      maxlength:20,
    },

    adminRole : {
      type : String ,
    },

    isSuperAdmin: {
      type:Boolean,
      default: false,
    },

     roomNoAssigned: {
      type:String,
      unique: true,
      required: true,
    },

    password: {
      type:String,
      required: true,
    },


  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.isPasswordCorect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      roomNoAssigned: this.roomNoAssigned,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;