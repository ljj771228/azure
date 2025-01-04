# 晓鸥能源语音助手

## 本地部署步骤

1. 安装 Node.js
   - 下载并安装 Node.js (建议版本 16+)
   - 下载地址：https://nodejs.org/

2. 配置环境
   - 复制 `.env.example` 为 `.env`
   - 在 `.env` 中填入你的 Azure 配置：
     ```
     VITE_AZURE_REGION=eastasia
     VITE_AZURE_SUBSCRIPTION_KEY=你的密钥
     ```

3. 安装依赖
   ```bash
   npm install
   ```

4. 运行项目
   ```bash
   # 开发模式
   npm run dev
   
   # 或者构建后运行
   npm run build
   npm run preview
   ```

5. 访问应用
   - 开发模式：http://localhost:3000
   - 预览模式：http://localhost:4173

## 常见问题

1. 如果遇到网络问题：
   - 确保能访问 Azure 语音服务
   - 检查 .env 文件配置是否正确

2. 如果遇到依赖安装问题：
   - 尝试使用 `npm install --legacy-peer-deps`
   - 或者使用离线包安装：`npm install ./xiaoou-voice-assistant.tgz` 

3.在新机器上运行
# 1. 解压部署包
tar -xzf xiaoou-voice-assistant.tar.gz

# 2. 修改 .env 中的配置
编辑 .env 文件，填入正确的 Azure 密钥

# 3. 安装依赖
npm install

# 4. 运行项目
npm run dev