import React from 'react';
import { TitleBar, Sidebar, Content } from '../components';

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-[#ffffff]">
      {/* 标题栏 - 类似 macOS 风格 */}
      <TitleBar className="h-12 bg-[#f8f8f8] border-b border-[#e5e5e5]" />
      
      <div className="flex-1 flex">
        {/* 侧边栏 - 类似 Finder 风格 */}
        <Sidebar className="w-64 bg-[#f5f5f7] border-r border-[#e5e5e5]" />
        
        {/* 主内容区 */}
        <Content className="flex-1 bg-white" />
      </div>
    </div>
  );
};

export default MainLayout; 