import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { clerkMiddleware, clerkClient, getAuth } from '@clerk/express';
import { authRoutes } from "./module/auth/auth.routes.js";
import resumeRouter from "./module/resume parsing/resumeParsing.route.js";
import githubRouter from "./module/github parsing/githubResume.route.js";
import jdRouter from "./module/JD parsing/jd.route.js";
import sessionRouter from "./module/session/session.route.js";

const app = express();

app.use(cors());

app.use('/api/auth', express.raw({ type: 'application/json' }), authRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.use('/session', sessionRouter);
app.use('/api/session', sessionRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/github', githubRouter);
app.use('/api/jd', jdRouter);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/protected', async (req, res) => {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const user = await clerkClient.users.getUser(userId);
    res.json({ user });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Error Handler:", err?.message || err);
    res.status(err.statusCode || 400).json({
        statusCode: err.statusCode || 400,
        success: false,
        message: err.message || "Invalid request or token format"
    });
});

const server = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
server();