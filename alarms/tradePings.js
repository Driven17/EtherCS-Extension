import { storageKey, store } from "../storage/store.js";

export const PING_TRADE_STATUS_ALARM_NAME = 'ethercs_trade_status_ping';

export async function pingTradeStatus() {

    await store.set(storageKey.LAST_TRADE_PING_ATTEMPT, Date.now());
    console.log('Pinged');

    /* INSERT TRADE PINGING LOGIC
    WITH ERROR CATCHING HERE */
    
    return;

}
