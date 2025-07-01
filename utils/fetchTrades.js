import { getAccessToken, convertSteamID32To64 } from "./steam.js";

/* 
Converts a Steam trade offer object into a simplified, structured format.
*/
function offerStateMapper(e) {
    return {
        offer_id: e.tradeofferid,
        state: e.trade_offer_state,
        given_asset_ids: (e.items_to_give || []).map(item => item.assetid),
        received_asset_ids: (e.items_to_receive || []).map(item => item.assetid),
        time_created: e.time_created,
        time_updated: e.time_updated,
        other_steam_id64: convertSteamID32To64(e.accountid_other),
    };
}

/*
Function that fetches sent trade by API
*/
export async function fetchTradesFromAPI() {
    const access = await getAccessToken();

    const resp = await fetch(
        `https://api.steampowered.com/IEconService/GetTradeOffers/v1/?access_token=${access.token}&get_sent_offers=true`,
        {
            credentials: 'include',
        }
    );

    if (resp.status !== 200) {
        throw new Error('invalid status');
    }

    const data = await resp.json();
    const offers = data.response?.trade_offers_sent || [];
    return offers.map(offerStateMapper);
}

/*
Get the user's sent trades through HTML - User must be logged into steam on the same browser
===== USELESS FUNCTION FOR NOW, SINCE THERE'S NO FUNCTION YET TO PARSE INDIVIDUAL TRADES OUT OF HTML ===
*/
export async function fetchTradesFromHTML() {

    const resp = await fetch(`https://steamcommunity.com/id/me/tradeoffers/sent`, {
        credentials: 'include',
        redirect: 'follow'
    });

    const body = await resp.text();

    if (body.match(/html .+? lang="en">/)) {
        return body;
    }

    const englishResp = await fetch(`${resp.url}?l=english`, {
        credentials: 'include',
        redirect: 'follow',
    });

    return englishResp.text();
}