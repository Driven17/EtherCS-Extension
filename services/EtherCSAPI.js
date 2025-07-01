import { env } from "../config/env.js"

/*
Fetches pending trades user has on platform EtherCS
*/
export async function fetchPendingTrades() {
    try {
        const resp = await fetch(`${env.ethercs_api_url}/me/get-pending-trades`, {
            credentials: 'include',
        });

        if (!resp.ok) {
            // Attempt to extract error message if present in JSON
            const errorData = await resp.json().catch(() => null);
            const reason = errorData?.reason || resp.statusText || 'Unknown error';
            throw new Error(`Server error (${resp.status}): ${reason}`);
        }

        const data = await resp.json();

        // Validate the structure
        if (!data || typeof data !== 'object' || !Array.isArray(data.trades)) {
            throw new Error('Malformed response structure');
        }

        return data;
    } catch (err) {
        console.error('[fetchPendingTrades] Error:', err);
        return { success: false, trades: [] }; // Safe fallback
    }
}

export async function processMatchingOffers(data) {
    try {
        const resp = await fetch(`${env.ethercs_api_url}/me/process-matching-offers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const text = await resp.text();  // safer than .json() directly

        if (!resp.ok) {
            console.error(`HTTP ${resp.status}: ${text}`);
            return { success: false, error: `HTTP ${resp.status}` };
        }

        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse JSON response:", text);
            return { success: false, error: "Invalid JSON response" };
        }

        if (!result || typeof result !== 'object') {
            console.error("Malformed result:", result);
            return { success: false, error: "Malformed response" };
        }

        return result;

    } catch (e) {
        console.error("Failed to send trade status update", e);
        return { success: false, error: "Fetch failed" };
    }
}