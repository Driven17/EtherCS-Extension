/*
Get steam "SessionID" cookie, user must be logged into steam on the same browser
(Firefox has limited `cookies.*` API support, it uses `browser.*`)
*/
export function getSteamSessionID() {
    return new Promise((resolve, reject) => {

        chrome.cookies.get({

            url: "https://steamcommunity.com",
            name: "sessionid"

        }, cookie => {

            if (cookie && cookie.value) {
                resolve(cookie.value);
            } else {
                reject(new Error("Steam sessionid cookie not found"));
            }

        });

    });
}

/*
Parses WebAPI access token from steamcommunity page
The JWT token is used for tracking/altering trades
*/
let cachedAccessToken = null;
export async function getAccessToken(expectedSteamID = null) {
    if (
        cachedAccessToken &&
        cachedAccessToken.token &&
        cachedAccessToken.updated_at > Date.now() - 30 * 60 * 1000
    ) {
        if (!expectedSteamID || expectedSteamID === cachedAccessToken.steam_id) {
            console.log(cachedAccessToken);
            return cachedAccessToken;
        }
    }

    const response = await fetch('https://steamcommunity.com', {
        credentials: 'include',
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9;q=0.8,application/signed-exchange;v=b3;q=0.7',
        },
    });

    const body = await response.text();

    const match = body.match(/data-loyalty_webapi_token="&quot;([a-zA-Z0-9_.-]+)&quot;"/);
    if (!match || !match[1]) {
        throw new Error('Failed to parse WebAPI token');
    }

    const token = match[1];

    const steamIDMatch = body.match(/g_steamID\s*=\s*["']?(\d{17})["']?/);
    if (!steamIDMatch || !steamIDMatch[1]) {
        throw new Error('Failed to extract SteamID64');
    }

    const steamID = steamIDMatch[1];

    if (expectedSteamID && steamID !== expectedSteamID) {
        throw new Error('SteamID does not match expected value');
    }

    cachedAccessToken = {
        token,
        steam_id: steamID,
        updated_at: Date.now(),
    };

    console.log(cachedAccessToken);
    return cachedAccessToken;
}