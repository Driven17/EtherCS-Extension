/*
Cancel trade offer through a post request
*/
export async function cancelTradeOffer(req) {
    if (!req || typeof req !== 'object') {
        throw new Error('Invalid request: req must be an object');
    }

    const { session_id, trade_offer_id } = req;

    if (!session_id || typeof session_id !== 'string') {
        throw new Error('Invalid or missing session_id');
    }

    if (!trade_offer_id || typeof trade_offer_id !== 'number') {
        throw new Error('Invalid or missing trade_offer_id');
    }

    const formData = new URLSearchParams({ sessionid: session_id }).toString();

    const resp = await fetch(`https://steamcommunity.com/tradeoffer/${trade_offer_id}/cancel`, {
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