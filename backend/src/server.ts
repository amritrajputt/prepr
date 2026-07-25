import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { clerkMiddleware } from '@clerk/express'
import {  clerkClient, getAuth } from '@clerk/express'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware())
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/protected', async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { isAuthenticated, userId } = getAuth(req)

  if (!isAuthenticated) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  // Use the `getUser()` method to get the user's User object
  const user = await clerkClient.users.getUser(userId)

  res.json({ user })
})

const server =  () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
server();