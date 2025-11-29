const express = require('express');
const app = express();

const port = process.env.PORT || 3090
app.use("/", async (req, res) => {
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

app.listen(port, () => {
    console.log("Backend ratelimit running on " + port);
})