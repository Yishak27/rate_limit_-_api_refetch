import express from "express";
import mongoose from "mongoose";
import dontenv from 'dotenv';
import { rateLimiter } from "./middleware/rateLimiter.js";
const app = express();

dontenv.config({
    path: ".env"
});

const port = process.env.PORT || 3090;
const mongoURL = process.env.DATABASE_CON_STRING;

app.use((req, res, next) => {
    console.log('Incoming request on url: ' + req.url + " Method: " + req.method);
    next();
})

app.post("/data",
    rateLimiter,
    async (req, res) => {
        try {
            return res.status(200).send({
                status: true,
                message: "Success."
            })
        } catch (error) {
            return res.status(500).send({
                status: false,
                message: "Internal server error"
            })
        }
    });

app.use((req, res) => {
    return res.status(404).send("Resource not found.")
});

mongoose.connect(mongoURL)
    .then(() => {
        console.log('Database connected successfully.');
    }).catch((err) => {
        console.log("Unable to connect to the database.");
    })

app.listen(port, () => {
    console.log("Backend ratelimit running on " + port);
})