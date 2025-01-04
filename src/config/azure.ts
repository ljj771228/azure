export const azureConfig = {
  region: import.meta.env.VITE_AZURE_REGION || 'eastasia',
  subscriptionKey: import.meta.env.VITE_AZURE_SUBSCRIPTION_KEY,
  defaultVoice: 'zh-CN-XiaoxiaoNeural',
  defaultLanguage: 'zh-CN'
};

// 验证配置
if (!azureConfig.subscriptionKey) {
  console.error('Azure subscription key is missing. Please check your .env file.');
}

if (!azureConfig.region) {
  console.error('Azure region is missing. Please check your .env file.');
} 