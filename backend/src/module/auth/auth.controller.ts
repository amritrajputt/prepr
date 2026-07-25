import type { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { AuthService } from "./auth.service.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";

const getSigningSecret = () =>
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ||
    process.env.CLERK_WEBHOOK_SECRET ||
    process.env.SIGNING_SECRET;

export class AuthController {
    static async createUser(req: Request, res: Response) {
        try {
            const secret = getSigningSecret();
            const evt = await verifyWebhook(req, secret ? { signingSecret: secret } : undefined);
            if (evt.type === "user.created") {
                await AuthService.createUser(evt.data);
                return res.status(201).json(ApiResponse.created(null, "User created successfully"));
            }
            return res.status(200).json(ApiResponse.success(null, "Webhook processed"));
        } catch (err: any) {
            console.error("Webhook verification error (createUser):", err?.message || err);
            return res.status(400).json(ApiError.badRequest(err.message || "Failed to process user creation webhook"));
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const secret = getSigningSecret();
            const evt = await verifyWebhook(req, secret ? { signingSecret: secret } : undefined);
            if (evt.type === "user.updated") {
                await AuthService.updateUser(evt.data);
                return res.status(200).json(ApiResponse.success(null, "User updated successfully"));
            }
            return res.status(200).json(ApiResponse.success(null, "Webhook processed"));
        } catch (err: any) {
            console.error("Webhook verification error (updateUser):", err?.message || err);
            return res.status(400).json(ApiError.badRequest(err.message || "Failed to process user update webhook"));
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const secret = getSigningSecret();
            const evt = await verifyWebhook(req, secret ? { signingSecret: secret } : undefined);
            if (evt.type === "user.deleted") {
                await AuthService.deleteUser(evt.data);
                return res.status(200).json(ApiResponse.success(null, "User deleted successfully"));
            }
            return res.status(200).json(ApiResponse.success(null, "Webhook processed"));
        } catch (err: any) {
            console.error("Webhook verification error (deleteUser):", err?.message || err);
            return res.status(400).json(ApiError.badRequest(err.message || "Failed to process user deletion webhook"));
        }
    }
}