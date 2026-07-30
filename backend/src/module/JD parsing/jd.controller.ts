import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { JDService } from "./jd.service.js";
export class JDController{
    static async saveJd(req:Request, res:Response){
       const userId =  getAuth(req).userId;
        if(!userId){
             return res.status(401).json(ApiError.unauthorized("Unauthorized"))
        }
        const {jdText} = req.body;
        if(!jdText){
            return res.status(400).json(ApiError.badRequest("No jdText provided"))
        }
        try {
            const jd = await JDService.saveJd(userId,jdText)
            return res.status(200).json(ApiResponse.success({userId, jd}))
        } catch (err: any) {
            console.error("JD save error:", err)
            return res.status(500).json(ApiError.internal(err.message))
        }
    }
}