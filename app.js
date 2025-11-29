import express from 'express';
import dotenv from 'dotenv';
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

app.listen(port, () => {
    console.log("Backend api call service running on " + port);
})