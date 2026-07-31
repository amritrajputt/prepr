import { Router, text } from "express";
import { SessionController } from "./session.controller.js";

const sessionRouter: Router = Router();

sessionRouter.use(text({ type: ["application/sdp", "text/plain", "*/*"] }));

sessionRouter.post("/:interviewId", SessionController.createSession);

export default sessionRouter;
