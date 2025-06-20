import { CreateTradeOffer } from "./createTrade.js";
import { getSteamSessionID } from "./steam.js";

export function registerMessageHandlers() {
    chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
        if (request.type === "send_trade_offer") {
            console.log("[Background] Received send_trade_offer:", request.payload);

            try {
                const sessionID = await getSteamSessionID();
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

            return true; // Keeps message channel open
        }
    });
}