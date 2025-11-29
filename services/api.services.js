import constant from "../constant/constant.js";
class APIService {
    static async fetchWithRetry(url, retries = constant.Config.RETRY_TIME) {
        try {
            let lastError;

            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    console.log(`Attemptss ,,, ${attempt}/${retries}...`);
                    const response = await fetch(url);
                    if (!response.ok) {
                        return {
                            success: false,
                            message: `Failed to fetch data: ${response.statusText}`
                        }
                    }
                    return {
                        status: true,
                        message: "success.",
                        data: await response.json()
                    };
                } catch (error) {
                    lastError = error;
                    console.log(`Attempt ${attempt} failed: ${error.message}`);
                    if (attempt === retries) {
                        return {
                            success: false,
                            message: `All retries failed: ${lastError.message}`
                        }
                    }
                    await new Promise(res => setTimeout(res, constant.Config.RETRY_TIMEOUT));
                }
            }
        } catch (error) {
            return {
                success: false,
                message: `Failed to fetch data: ${error.message}`
            }
        }
    }
}

export default APIService