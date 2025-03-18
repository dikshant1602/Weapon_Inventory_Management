import { Router } from "express";
import { addBullets, addSubCategories, addWeaponCategories, getBullets, getCategories, getSubCategories, getWeapon } from "../controllers/weaponCategory.controller.js";
import { jwtVerifyAdmin } from "../middlewares/auth.middlewares.js";


const router = Router();


router.route("/addWeaponCategories").post( jwtVerifyAdmin,addWeaponCategories)

router.route("/addSubCategories").post( jwtVerifyAdmin,addSubCategories)

router.route("/getCategories").get(jwtVerifyAdmin,  getCategories)

router.route("/getSubCategories/:category").get( jwtVerifyAdmin, getSubCategories)

router.route("/getWeapon/:category/:subCategory").get( jwtVerifyAdmin, getWeapon)

router.route("/addBullets").post( jwtVerifyAdmin, addBullets)

router.route("/getBullets").get( jwtVerifyAdmin, getBullets)

export default router