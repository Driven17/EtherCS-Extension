console.log("[Handler] CreateTradeOffer loaded"); // Confirmation that extension is setup

async function CreateTradeOffer(req) {
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

// Function to fetch sessionid cookie (User has to be logged into steam on the same browser)
function getSteamSessionID() {
    return new Promise((resolve, reject) => {

        chrome.cookies.get({

            url: "https://steamcommunity.com",
            name: "sessionid"

        }, cookie => {

            if (cookie && cookie.value) {
                resolve(cookie.value);
            } else {
                reject(new Error("Steam sessionid cookie not found"));
            }

        });

    });
}

chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
    if (request.type === "send_trade_offer") {
        console.log("[Background] Received send_trade_offer:", request.payload);

        try {
            // Get session ID from Steam cookie
            const sessionID = await getSteamSessionID();

            // Merge payload with sessionID
            const req = {
                ...request.payload,
                sessionID,
                forceEnglish: true
            };

            const result = await CreateTradeOffer(req);
            console.log("[Background] Trade offer result:", result);
            sendResponse(result);
        } catch (err) {
            console.error("[Background] Error sending trade offer:", err);
            sendResponse({ status: 500, error: err.message });
        }

        return true;
    }
});
