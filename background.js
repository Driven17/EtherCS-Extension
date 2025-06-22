import { registerMessageHandlers } from './utils/messageHandlers.js';
import { fetchTradesFromAPI, fetchTradesFromHTML } from './utils/fetchTrades.js';

console.log("[Message] Background script loaded.")

/* Temporarily globalize the following 
functions for testing through console. */

globalThis.fetchTradesFromAPI = fetchTradesFromAPI;
globalThis.fetchTradesFromHTML = fetchTradesFromHTML;

// Register all external message listeners
registerMessageHandlers();
