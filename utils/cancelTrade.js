/*
Cancel trade offer through a post request
*/
export async function cancelTradeOffer(req) {

    const formData = new URLSearchParams({
        sessionid: req.session_id
    }).toString();

    const resp = await fetch(`https://steamcommunity.com/tradeoffer/${req.trade_offer_id}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: formData
    });

    if (resp.status !== 200) {
        throw new Error(`Failed to cancel offer: ${resp.status}`);
    }

    return {};
}