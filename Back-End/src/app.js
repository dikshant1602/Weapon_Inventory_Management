import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import adminRouter from "./routes/admin.routes.js";
import weaponCategoryRouter from "./routes/weaponCategory.routes.js";
import weaponRouter from "./routes/weapon.routes.js";
import issuanceRouter from "./routes/issued.routes.js";

const app = express();

app.use (cors ({
    origin : process.nextTick.CORS_ORIGIN,
    credential : true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended :true}))
app.use(express.static("public"))
app.use(cookieParser())


//Router is defined here


app.use("/api/admin",adminRouter);
app.use("/api/weaponCategory", weaponCategoryRouter);  
app.use("/api/weapon", weaponRouter);
app.use("/api/issuance", issuanceRouter);


 
// localhost:10000/api/users/demo

export {app}