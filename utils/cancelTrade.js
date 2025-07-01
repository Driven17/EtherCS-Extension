import { getSteamSessionID } from "./steam.js";

/*
Cancel trade offer through a post request
*/
export async function cancelTradeOffer(tradeOfferId) {

    const session_id = await getSteamSessionID()

    if (!session_id || typeof session_id !== 'string') {
        throw new Error('Invalid or missing session_id');
    }

    if (!tradeOfferId) {
        throw new Error('Missing trade_offer_id');
    }

    const formData = new URLSearchParams({ sessionid: session_id }).toString();

    const resp = await fetch(`https://steamcommunity.com/tradeoffer/${tradeOfferId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formData
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Cancel failed: ${resp.status} ${resp.statusText}\n${text}`);
    }

    return {};
}