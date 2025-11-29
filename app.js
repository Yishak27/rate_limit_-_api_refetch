import express from 'express';
import dotenv from 'dotenv';
import APIService from './services/api.services.js';
dotenv.config({
    path: ".env"
})
const app = express();
const port = process.env.PORT || 3091;

app.use(express.json());
app.use((req, res, next) => {
    console.log('Incoming request on url: ' + req.url + " Method: " + req.method);
    next();
})

app.get("/getData", async (req, res) => {
    try {
        const url = "fake api fortesting";
        const data = await APIService.fetchWithRetry(url);
        return res.status(200).send({
            success: true,
            data
        })
    } catch (error) {
        console.log('error in route,', error);
        return res.status(500).send({
            status: false,
            message: "Internal server error."
        })
    }
})

app.listen(port, () => {
    console.log("Backend api call service running on " + port);
})