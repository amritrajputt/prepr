import { Router } from "express";
import { JDController } from "./jd.controller.js"
const jdRouter : Router = Router()

jdRouter.post("/parsejd", JDController.saveJd)
export default jdRouter
