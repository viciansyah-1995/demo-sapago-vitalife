import 'server-only';
export type CustomChannel = 'tiktok-shop' | 'shopee' | 'instagram-dm';
const config: Record<CustomChannel, { account: string | undefined; callback: string | undefined; callbackPath: string }> = {
  'tiktok-shop': { account: process.env.TALKY_CUSTOM_CHANNEL_TIKTOK_ACCOUNT_ID || 'admin123', callback: process.env.TALKY_CUSTOM_CHANNEL_TIKTOK_CALLBACK_URL || 'https://demo-sapago-vitalife.vercel.app/api/callback/tiktok-shop', callbackPath: '/api/callback/tiktok-shop' },
  shopee: { account: process.env.TALKY_CUSTOM_CHANNEL_SHOPEE_ACCOUNT_ID || 'admin123', callback: process.env.TALKY_CUSTOM_CHANNEL_SHOPEE_CALLBACK_URL || 'https://demo-sapago-vitalife.vercel.app/api/callback/shopee', callbackPath: '/api/callback/shopee' },
  'instagram-dm': { account: process.env.TALKY_CUSTOM_CHANNEL_INSTAGRAM_ACCOUNT_ID || 'admin123', callback: process.env.TALKY_CUSTOM_CHANNEL_INSTAGRAM_CALLBACK_URL || 'https://demo-sapago-vitalife.vercel.app/api/callback/instagram-dm', callbackPath: '/api/callback/instagram-dm' },
};
export function getCustomChannelConfig(channel: CustomChannel) { const item = config[channel]; return { accountId: item.account, token: process.env.TALKY_CUSTOM_CHANNEL_API_TOKEN || 'admin123', secret: process.env.TALKY_CUSTOM_CHANNEL_SECRET || 'admin123', apiBaseUrl: process.env.TALKY_API_BASE_URL || 'https://api.talky.id/v1', callbackUrl: item.callback || `${process.env.APP_URL || 'https://demo-sapago-vitalife.vercel.app'}${item.callbackPath}` }; }
export function isCustomChannel(value: string): value is CustomChannel { return value in config; }
