// utils/configUtils.js

export function getConfigValue(configs, key) {
    const config = configs?.find(item => item.key === key);
    return config ? config.value : false;
}
