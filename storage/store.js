export const storageKey = {
    ACCESS_TOKEN: 'access_token',
    LAST_TRADE_PING_ATTEMPT: 'last_trade_ping_attempt',
};

class Store {
    async get(key) {
        const data = await chrome.storage.local.get(key);
        if (!data || !(key in data)) return null;

        try {
            return JSON.parse(data[key]);
        } catch (e) {
            return data[key];
        }
    }

    async set(key, value) {
        return chrome.storage.local.set({ [key]: JSON.stringify(value) });
    }

    async remove(key) {
        return chrome.storage.local.remove(key);
    }
}

export const store = new Store();