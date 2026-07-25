import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { clerkMiddleware, clerkClient, getAuth } from '@clerk/express';
import { authRoutes } from "./module/auth/auth.routes.js";

const app = express();

app.use(cors());

app.use('/api/auth', express.raw({ type: 'application/json' }), authRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

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

const server = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
server();