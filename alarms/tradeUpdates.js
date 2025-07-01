import { fetchTradesFromAPI } from "../utils/fetchTrades.js";
import { storageKey, store } from "../storage/store.js";
import { processMatchingOffers } from "../services/EtherCSAPI.js";

export async function pingSentTrades(pendingTrades) {
    let resp;

    try {
        resp = await fetchTradesFromAPI();
        console.log(resp);
        if (!Array.isArray(resp) || resp.length < 1) {
            console.log("No!");
            return;
        }
    } catch (e) {
        await store.remove(storageKey.ACCESS_TOKEN);
        console.error("Failed to fetch trades, removed access token", e);
        return;
    }

    const offerIdMap = pendingTrades.reduce((acc, trade) => {
        if (trade.offer_id) {
            acc[trade.offer_id] = true;
        }
        return acc;
    }, {});

    const matchingOffers = resp.filter((offer) => offerIdMap[offer.offer_id]);

    console.log("Matching offers:", matchingOffers);

    const result = await processMatchingOffers(matchingOffers)

    console.log(result)

    if (!result.success) {
        throw new Error("Failed to proccess trades, servers may be down")
    }
    
    return;
}