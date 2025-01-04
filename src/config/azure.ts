interface AzureConfig {
  region: string;
  subscriptionKey: string;
  defaultVoice: string;
  defaultLanguage: string;
  defaultRecognitionLanguage: string;
}

// 验证环境变量
const validateConfig = () => {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];
  
  if (!import.meta.env.VITE_AZURE_REGION) {
    missingVars.push('VITE_AZURE_REGION');
  } else if (!/^[a-z]+$/i.test(import.meta.env.VITE_AZURE_REGION)) {
    invalidVars.push('VITE_AZURE_REGION (invalid format)');
  }

  if (!import.meta.env.VITE_AZURE_SUBSCRIPTION_KEY) {
    missingVars.push('VITE_AZURE_SUBSCRIPTION_KEY');
  } else if (import.meta.env.VITE_AZURE_SUBSCRIPTION_KEY.length < 32) {
    invalidVars.push('VITE_AZURE_SUBSCRIPTION_KEY (invalid length)');
  }

  if (missingVars.length > 0) {
    throw new Error(`缺少必要的环境变量: ${missingVars.join(', ')}`);
  }

  if (invalidVars.length > 0) {
    throw new Error(`环境变量格式错误: ${invalidVars.join(', ')}`);
  }
};

// 尝试验证配置
try {
  validateConfig();
} catch (error: any) {
  console.error('配置错误:', error.message);
  console.error('请检查 .env 文件并确保所有必要的变量都已设置。');
}

export const azureConfig: AzureConfig = {
  region: import.meta.env.VITE_AZURE_REGION,
  subscriptionKey: import.meta.env.VITE_AZURE_SUBSCRIPTION_KEY,
  defaultVoice: 'zh-CN-XiaoxiaoNeural',
  defaultLanguage: 'zh-CN',
  defaultRecognitionLanguage: 'zh-CN'
};

// 添加配置日志（不包含敏感信息）
console.log('Azure 配置:', {
  region: azureConfig.region,
  defaultVoice: azureConfig.defaultVoice,
  defaultLanguage: azureConfig.defaultLanguage,
  hasSubscriptionKey: !!azureConfig.subscriptionKey,
  subscriptionKeyLength: azureConfig.subscriptionKey?.length
}); 