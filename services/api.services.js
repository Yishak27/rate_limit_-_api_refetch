import constant from "../constant/constant";
class APIService {
    static async fetchWithRetry(url, retries = constant.Config.RETRY_TIME) {
        try {
            let lastError;

            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    console.log(`Attemptss ,,, ${attempt}/${retries}...`);
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return await response.json();
                } catch (error) {
                    lastError = error;
                    console.log(`Attempt ${attempt} failed: ${error.message}`);
                    if (attempt === retries) {
                        throw new Error(`All retries failed: ${lastError.message}`);
                    }
                    await new Promise(res => setTimeout(res, constant.Config.RETRY_TIMEOUT));
                }
            }
        } catch (error) {

        }
    }
}

export default APIService