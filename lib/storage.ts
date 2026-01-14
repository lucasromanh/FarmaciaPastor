const KEY_POSTS = 'fp_planner_posts_v1';
const KEY_SETTINGS = 'fp_planner_settings_v1';
const KEY_PAYMENTS = 'fp_planner_payments_v1';

export const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving to storage", e);
    }
};

export const loadFromStorage = (key: string, defaultValue: any) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

export const storageKeys = { KEY_POSTS, KEY_SETTINGS, KEY_PAYMENTS };