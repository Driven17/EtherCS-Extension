import { registerMessageHandlers } from './utils/messageHandlers.js';
import { fetchTradesFromAPI, fetchTradesFromHTML } from './utils/fetchTrades.js';
import { fetchPendingTrades } from './services/EtherCSAPI.js';
import { getAccessToken } from './utils/steam.js';

console.log("[Message] Background script loaded.")

/* Temporarily globalize the following 
functions for testing through console. */

globalThis.getAccessToken = getAccessToken;
globalThis.fetchTradesFromAPI = fetchTradesFromAPI;
globalThis.fetchTradesFromHTML = fetchTradesFromHTML;
globalThis.fetchPendingTrades = fetchPendingTrades;

// Register all external message listeners
registerMessageHandlers();
