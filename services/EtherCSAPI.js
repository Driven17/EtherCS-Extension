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

