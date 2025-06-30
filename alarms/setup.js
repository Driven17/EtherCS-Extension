import { PING_TRADE_STATUS_ALARM_NAME, pingTradeStatus } from "./tradePings.js";

export async function alarmListener(alarm) {
    if (alarm.name === PING_TRADE_STATUS_ALARM_NAME) {
        await pingTradeStatus();
    }
}

async function registerAlarmListener() {
    if (chrome.alarms) {
        chrome.alarms.onAlarm.addListener(alarmListener);
    }
}

export async function registerTradeAlarm() {

    await registerAlarmListener();

    const alarm = await chrome.alarms.get(PING_TRADE_STATUS_ALARM_NAME);

    const hasAlarmWithOutdatedTimer =
        (alarm?.periodInMinutes && alarm.periodInMinutes > 3) ||
        (alarm?.scheduledTime && alarm.scheduledTime > Date.now() + 10 * 60 * 1000);

    if (!alarm || hasAlarmWithOutdatedTimer) {
        await chrome.alarms.create(PING_TRADE_STATUS_ALARM_NAME, {
            periodInMinutes: 0.5,
            delayInMinutes: 1,
        });
    }
}