import { registerMessageHandlers } from './utils/messageHandlers.js';
import { storageKey, store } from './storage/store.js';
import { pingTradeStatus } from './alarms/tradePings.js';
import { registerTradeAlarm } from './alarms/setup.js';

// Test imports
import { fetchTradesFromAPI, fetchTradesFromHTML } from './utils/fetchTrades.js';
import { fetchPendingTrades } from './services/EtherCSAPI.js';
import { getAccessToken } from './utils/steam.js';

/* Temporarily globalize the following 
functions for testing through console. */
globalThis.getAccessToken = getAccessToken;
globalThis.fetchTradesFromAPI = fetchTradesFromAPI;
globalThis.fetchTradesFromHTML = fetchTradesFromHTML;
globalThis.fetchPendingTrades = fetchPendingTrades;


console.log("[Message] Background script loaded.")

// Setup trade alarms to check trades
async function checkAlarmState() {
    await registerTradeAlarm();
}
checkAlarmState();

// Ping
async function checkTradeStatus() {
    const lastPing = await store.get(storageKey.LAST_TRADE_PING_ATTEMPT);
    if (!lastPing || lastPing < Date.now() - 0.5 * 60 * 1000) {
        pingTradeStatus()
    }
}
checkTradeStatus();

// Register all external message listeners
registerMessageHandlers();
