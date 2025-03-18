import { Router } from "express";
import { addWeaponDetail, addWeaponUnits, getWeaponDetailsBySerialNumber, getWeaponWithDetails, getWeaponWithDetailsAdd, getWeaponsDetailsforTables } from "../controllers/weapon.controller.js";
import { jwtVerifyAdmin } from "../middlewares/auth.middlewares.js";


const router = Router();


router.route("/addWeaponDetail").post( jwtVerifyAdmin, addWeaponDetail)

router.route("/addWeaponUnits").post( jwtVerifyAdmin, addWeaponUnits)



router.route("/getWeaponWithDetailsAdd/:weaponDetailId").get( jwtVerifyAdmin, getWeaponWithDetailsAdd)

router.route("/getWeaponsDetailsforTables/:category/:subCategory").get( jwtVerifyAdmin, getWeaponsDetailsforTables)

router.route("/getWeaponWithDetails").get( jwtVerifyAdmin , getWeaponWithDetails)

router.route("/getWeaponDetailsBySerialNumber/:serialNumber").get( jwtVerifyAdmin , getWeaponDetailsBySerialNumber)



export default router