import { registerMessageHandlers } from './utils/messageHandlers.js';

console.log("[Message] Background script loaded.")

// Register all external message listeners
registerMessageHandlers();
