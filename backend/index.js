import express from 'express'
import mongoose, {Mongoose} from 'mongoose'
import dotenv from 'dotenv'
import usersRoute from "./routes/user.routes.js";
import cors from 'cors'


const app = express();
app.use(express.json());
dotenv.config();

//connection
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGOURL;

//cors config
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
  };

app.use(cors(corsOptions));

// Testing the connection to env
if (!MONGOURL) {
    console.error("MONGOURL is not defined. Please check your .env file.");
    process.exit(1);
  }
  


  // Testing connection connected to MongoDB
  mongoose
    .connect(MONGOURL)
    .then(() => {
      console.log("Database is connected");
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });

  
  app.get("/", (req, res) => {
    res.send("Server and DB is working!");
  });

  app.use("/api/users", usersRoute);