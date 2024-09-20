import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersRoute from './routes/user.routes.js';
import contentRoutes from './routes/content.routes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));

app.use('/api/users', usersRoute);
app.use('/api/content', contentRoutes);
app.use('/profilepic', express.static(path.join(__dirname, 'profilepic')));
app.use('/usersUpload', express.static(path.join(__dirname, 'usersUpload')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGOURL;

if (!MONGOURL) {
    console.error("MONGOURL is not defined.");
    process.exit(1);
}

mongoose.connect(MONGOURL)
    .then(() => {
        console.log("Database is connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
