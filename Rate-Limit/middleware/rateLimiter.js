import RateLimit from "../schema/rateLimit.schema.js";
import Constants from '../constants/constant.js'

const RATE_LIMIT = Constants.MainConfig.RATE_LIMIT;
const WINDOW_MS = Constants.MainConfig.WINDOW_MS;

export async function rateLimiter(req, res, next) {
    try {
        // also we can able to read it from the access token,
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(400).send({ message: "User ID required" });
        }

        let record = await RateLimit.findOne({ userId });
        const now = Date.now();
        if (!record) {
            await RateLimit.create({
                userId,
                requests: 1,
                windowStart: now,
            });
            return next();
        }
        const timePassed = now - record.windowStart;
        if (timePassed > WINDOW_MS) {
            record.requests = 1;
            record.windowStart = now;
            await record.save();
            return next();
        }

        if (record.requests >= RATE_LIMIT) {
            return res.status(429).send({
                status:false,
                message: "Rate limit exceeded. Try again later.",
            });
        }

        record.requests += 1;
        await record.save();

        next();
    } catch (error) {
        return res.status(400).send({
            status:false,
            message:"Unable to identify the user. Please try again."
        })
    }
}
