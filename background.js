import { registerMessageHandlers } from './utils/messageHandlers.js';
import { storageKey, store } from './storage/store.js';
import { pingTradeStatus } from './alarms/tradePings.js';
import { registerTradeAlarm } from './alarms/setup.js';

console.log("[Message] Background script loaded.")

// Setup trade alarms to check trades
async function checkAlarmState() {
    await registerTradeAlarm();
}
checkAlarmState();

async function checkTradeStatus() {
    const lastPing = await store.get(storageKey.LAST_TRADE_PING_ATTEMPT);
    if (!lastPing || lastPing < Date.now() - 3 * 60 * 1000) {
        pingTradeStatus()
    }
}
checkTradeStatus();

// Register all external message listeners
registerMessageHandlers();
