import mongoose from "mongoose"; 


const damageWeaponSchema = new mongoose.Schema({ 


    weaponId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Weapon",
        required: [true, "Please provide weaponId"]
    },

    damageDate : {
        type: Date,
        default: Date.now
    },

    damageBy : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SoldierDetails"
        }
    ],

    forRoom : {
        type: String,
        required: [true, "Please provide room"]
    },

    damageType : {
        type: String,
        required: [true, "Please provide damage type"],
    },

    ReasonDamage : {
        type: String,
        required: [true, "Please provide reason"]
    },

    retundDate : {
        type: Date,
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

   }, { timestamps: true });


export const DamageWeapon = mongoose.model("DamageWeapon", damageWeaponSchema);