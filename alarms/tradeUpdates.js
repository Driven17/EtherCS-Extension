import { fetchTradesFromAPI } from "../utils/fetchTrades.js";
import { processMatchingOffers } from "../services/EtherCSAPI.js";
import { cancelTradeOffer } from "../utils/cancelTrade.js";
import { storageKey, store } from "../storage/store.js";

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

    if (!result.success) {
        throw new Error("Failed to proccess trades, servers may be down")
    }

    return;
}

export async function pingCancelledTrades(pendingTrades) {
    let resp;

    try {
        resp = await fetchTradesFromAPI();
        console.log("Fetched trades:", resp);

        if (!Array.isArray(resp) || resp.length < 1) {
            console.log("No trades found.");
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

    const now = Math.floor(Date.now() / 1000); // Convert to seconds

    const offersToCancel = resp.filter((offer) => {
        return (
            offerIdMap[offer.offer_id] &&
            offer.state === 2 &&
            now - offer.time_updated > 30 * 60
        );
    });

    console.log("Matching active offers (older than 30 mins):", offersToCancel);
    for (const offer of offersToCancel) {
        try {
            await cancelTradeOffer(offer.offer_id);
            console.log(`Cancelled expired offer ${offer.offer_id}`);
        } catch (e) {
            console.error(`Failed to cancel offer ${offer.offer_id}`, e);
        }
    }

    return offersToCancel;
}