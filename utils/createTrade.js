/*
Send trade offer through a post request
*/
export async function createTradeOffer(req) {
    function itemMapper(assetID) {
        return {
            appid: 730,
            contextid: 2,
            amount: 1,
            assetid: assetID,
        };
    }

    const offerData = {
        newversion: true,
        version: req.assetIDsToGive.length + req.assetIDsToReceive.length + 1,
        me: {
            assets: req.assetIDsToGive.map(itemMapper),
            currency: [],
            ready: false,
        },
        them: {
            assets: req.assetIDsToReceive.map(itemMapper),
            currency: [],
            ready: false,
        },
    };

    const params = {
        trade_offer_access_token: req.tradeToken,
    };

    // Build form data that'll be sent by post in body
    const formData = new URLSearchParams({
        sessionid: req.sessionID,
        serverid: 1,
        partner: req.toSteamID64,
        tradeoffermessage: req.message || 'EtherCS Trade Offer',
        json_tradeoffer: JSON.stringify(offerData),
        captcha: '',
        trade_offer_create_params: JSON.stringify(params),
    });

    const url = req.forceEnglish
        ? 'https://steamcommunity.com/tradeoffer/new/send?l=english'
        : 'https://steamcommunity.com/tradeoffer/new/send';

    console.log("[CreateTradeOffer] Sending offer to URL:", url);
    console.log("[CreateTradeOffer] FormData:", formData.toString());

    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData.toString(),
            credentials: 'include',
            mode: 'cors',
        });
    } catch (err) {
        console.error("[CreateTradeOffer] Network error:", err);
        return { status: 500, error: err.message };
    }

    const text = await response.text();
    let json = null;

    try {
        json = JSON.parse(text);
    } catch (e) {
        console.warn("[CreateTradeOffer] Failed to parse Steam response JSON:", e);
    }

    console.log("[CreateTradeOffer] Response status:", response.status);
    console.log("[CreateTradeOffer] Response text:", text);

    return {
        status: response.status,
        text,
        json
    };
}