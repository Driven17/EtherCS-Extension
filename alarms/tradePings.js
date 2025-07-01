import { storageKey, store } from "../storage/store.js";
import { fetchPendingTrades } from "../services/EtherCSAPI.js";
import { pingSentTrades, pingCancelledTrades } from "./tradeUpdates.js";

export const PING_TRADE_STATUS_ALARM_NAME = 'ethercs_trade_status_ping';

export async function pingTradeStatus(/* Expected SteamID here */) {

    await store.set(storageKey.LAST_TRADE_PING_ATTEMPT, Date.now());
    console.log('Pinged');

    /* INSERT LOGIC FOR TRADE
    TRACKING PERMISSIONS HERE */

    let pendingTrades;
    try {

        const resp = await fetchPendingTrades()
        if (!resp.success) {
            return;
        }
        pendingTrades = resp.trades;

    } catch (e) {

        console.error(e);
        console.log('Error, try logging into EtherCS | EtherCS servers may be down');
        return;
    }

    let access;

    try {
        access = await getAccessToken(/* Expected SteamID here */);
    } catch (e) {
        console.error('failed to fetch access token', e);
    }

    const response = [];
    if (pendingTrades.length > 0) {
        const response = await pingUpdates(pendingTrades);
    }

    return response;

}

async function pingUpdates(pendingTrades) {
    try {
        await pingSentTrades(pendingTrades);
    } catch (e) {
        console.error('failed to ping sent offers', e);
    }

    try {
        await pingCancelledTrades(pendingTrades);
    } catch (e) {
        console.error('failed to ping sent offers', e);
    }
}