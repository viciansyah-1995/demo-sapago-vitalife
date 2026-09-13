import type { Channel } from './data';
/** Replace with an HTTPS iframe embed URL supplied by SapaGo. Never put secret API keys here. */
export const SAPAGO_WIDGET_URL = 'SAPAGO_WIDGET_EMBED_URL';
/** Optional per-channel iframe URLs; a blank value uses the global URL. */
export const SAPAGO_CHANNEL_URLS: Partial<Record<Channel,string>> = {};
export function getWidgetUrl(channel:Channel){const raw=SAPAGO_CHANNEL_URLS[channel] || SAPAGO_WIDGET_URL;try{const url=new URL(raw);return url.protocol==='https:'?url.href:null;}catch{return null;}}
