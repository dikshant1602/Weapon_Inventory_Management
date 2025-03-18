import {Router} from "express";
// import { jwtVerifyAdmin,  jwtVerifyUser } from "../middlewares/auth.middlewares.js";

import {  registerAdmin, signOutAdmin, signInAdmin, fatchData, superLogin, fetchRoomIncharge, getDashbord, changePassword} from "../controllers/admin.controller.js";
import { jwtVerifyAdmin, jwtVerifySuperAdmin } from "../middlewares/auth.middlewares.js";
import { changePasswordSign, createverification, getRooms, repleceOfficer, verifySign } from "../controllers/singVerification.controler.js";

const router = Router();
 

router.route("/login").post(signInAdmin);


router.route("/logOut").post(jwtVerifyAdmin ,signOutAdmin)

router.route("/fatchData").get(jwtVerifyAdmin ,fatchData)



router.route("/verifySign/:role").post( jwtVerifyAdmin , verifySign)

router.route("/getDashbord").get(jwtVerifyAdmin , getDashbord)

//super admin

router.route("/superLogin/:roomNoAssigned").get(jwtVerifySuperAdmin , superLogin)


router.route("/changePassword").post(jwtVerifySuperAdmin , changePassword)

router.route("/getIncharge").get(jwtVerifySuperAdmin , fetchRoomIncharge)

router.route("/registerAdmin").post( jwtVerifySuperAdmin  ,  registerAdmin)

router.route("/ganrateVerification").post( jwtVerifySuperAdmin , createverification)






router.route("/getRooms").get(jwtVerifySuperAdmin , getRooms)

router.route("/changePasswordSign").post(jwtVerifySuperAdmin , changePasswordSign)

router.route("/replaceOfficer").post(jwtVerifySuperAdmin , repleceOfficer)



export default router;