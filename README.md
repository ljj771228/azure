# Azure Voice Assistant (Azure语音助手)

一款优雅简洁的 Azure 语音服务工具，采用苹果设计风格，让语音服务的使用变得简单自然。

## 功能特点

### 核心功能
- 文字转语音 (Text-to-Speech)
  - 自然声音合成
  - 多种声音选择
  - 语速和音调调节

### 特色功能
- 简洁优雅的用户界面
- 快捷键支持
- 历史记录管理
- 云端同步
- 黑暗模式支持

## 环境配置

1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 中填入你的 Azure 配置：
   ```
   VITE_AZURE_REGION=eastasia
   VITE_AZURE_SUBSCRIPTION_KEY=your_subscription_key_here
   ```

## 开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开浏览器访问：http://localhost:3000

## 故障排除

1. 检查浏览器控制台（F12）是否有错误信息
2. 确认 .env 文件中的配置是否正确
3. 检查网络连接是否正常 