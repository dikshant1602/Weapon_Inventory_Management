import { Router } from "express";
import { jwtVerifyAdmin } from "../middlewares/auth.middlewares.js";
// import { addDailyIssued, returnDailyIssued } from "../controllers/dailyIssued.controller.js";
import { addIssuedRecord, approveCOJCOOneTime, createSoldier, fetchWeaponsFirst, retundWeapon, soldierDetails } from "../controllers/issuancRecord.controller.js";
import { addDailyIssued, approveCOJCO, fetchdailyRecord, fetchWeapons, returnDailyIssued } from "../controllers/dailyIssued.controller.js";
import { approveCOJCODamage, fetchDamageWeapon, MaintenanceComplete } from "../controllers/damage.weapon.controller.js";


const router = Router();


// one this issue
router.route("/fetchWeaponsFirst/:serialNo").get( jwtVerifyAdmin , fetchWeaponsFirst )

router.route("/addIssuedRecord").post( jwtVerifyAdmin , addIssuedRecord )

router.route("/fetchSoldier/:armyId").get(jwtVerifyAdmin, soldierDetails)

router.route("/createSoldier").post( jwtVerifyAdmin , createSoldier)

router.route("/approveCOJCOOneTime").post( jwtVerifyAdmin ,  approveCOJCOOneTime )

router.route("/retundWeapon").post( jwtVerifyAdmin , retundWeapon)


//daily issued

router.route("/addDailyIssued").post( jwtVerifyAdmin , addDailyIssued  )

router.route("/returnDailyIssued").post( jwtVerifyAdmin , returnDailyIssued )

router.route("/fetchDailyRecord").get( jwtVerifyAdmin ,  fetchdailyRecord )


router.route("/fetchIssuedWeapon/:serialNumber").get( jwtVerifyAdmin ,  fetchWeapons )

router.route("/approveCOJCO").post( jwtVerifyAdmin ,  approveCOJCO )





// damage weapon

router.route("/fetchDamageWeapon").get( jwtVerifyAdmin ,  fetchDamageWeapon )
router.route("/approveCOJCODamage").post( jwtVerifyAdmin ,  approveCOJCODamage )

router.route("/reatunInDamage/:recordIDs").get( jwtVerifyAdmin ,  MaintenanceComplete )




export default router