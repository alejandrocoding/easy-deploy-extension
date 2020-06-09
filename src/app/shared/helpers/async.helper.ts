import { Settings } from '../interfaces/settings.interface';

export const sleep = (ms: number) => new Promise((cb: () => void) => setTimeout(cb, ms));

export const getSettingsStorage = (): Promise<Settings | null> => {
    return new Promise((resolve) => {
        chrome.storage.sync.get('settings', (data: { settings: Settings }) => {
            if (data?.settings?.environments?.length) {
                return resolve(data.settings);
            }
            return resolve(null);
        });
    });
};

export const setSettingsStorage = (value: Settings): Promise<Settings> => {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ settings: value }, () => {
            return resolve(value);
        });
    });
};
