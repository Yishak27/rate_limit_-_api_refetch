import express from "express";
import mongoose from "mongoose";
import dontenv from 'dotenv';


import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import morgan from "morgan";


import { rateLimiter } from "./middleware/rateLimiter.js";
const app = express();

dontenv.config({
    path: ".env"
});

const port = process.env.PORT || 3090;
const mongoURL = process.env.DATABASE_CON_STRING;
app.use(helmet());

app.use(cors({
    origin: "*",
    methods: "POST",
}));
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());


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