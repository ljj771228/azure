import React from 'react';
import WindowControls from './WindowControls';

const TitleBar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center justify-between px-4 ${className}`}>
      <WindowControls />
      <div className="flex space-x-4">
        <button className="px-4 py-2 rounded-md hover:bg-[#f0f0f0] dark:hover:bg-[#3c3c3c]">
          语音转文字
        </button>
        <button className="px-4 py-2 rounded-md hover:bg-[#f0f0f0] dark:hover:bg-[#3c3c3c]">
          文字转语音
        </button>
        <button className="px-4 py-2 rounded-md hover:bg-[#f0f0f0] dark:hover:bg-[#3c3c3c]">
          语音翻译
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-[#f0f0f0] dark:hover:bg-[#3c3c3c]">
          {/* 设置图标 */}
        </button>
      </div>
    </div>
  );
};

export default TitleBar; 