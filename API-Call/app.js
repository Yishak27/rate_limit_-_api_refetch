import express from 'express';
import dotenv from 'dotenv';

import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import morgan from "morgan";

import APIService from './services/api.services.js';
dotenv.config({
    path: ".env"
})
const app = express();
const port = process.env.PORT || 3091;

app.use(hpp());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.json());

app.use((req, res, next) => {
    console.log('Incoming request on url: ' + req.url + " Method: " + req.method);
    next();
})

app.get("/getData", async (req, res) => {
    try {
        const url = "https://jsonplaceholder.typicode.com/posts/1";
        const data = await APIService.fetchWithRetry(url);
        if (data && data.status) {
            return res.status(200).send(data)
        } else {
            return res.status(400).send(data)
        }
    } catch (error) {
        console.log('error in route,', error);
        return res.status(500).send({
            status: false,
            message: "Internal server error."
        })
    }
})

app.use((req, res) => {
    return res.status(404).send("Resource not found")
})

app.listen(port, () => {
    console.log("Backend api call service running on " + port);
})