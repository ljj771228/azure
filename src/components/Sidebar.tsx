import React from 'react';

const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 收藏夹区域 */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#666666] mb-2">收藏夹</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-md text-[#333333] hover:bg-[#f0f0f0] transition-colors">
            最近使用
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md text-[#333333] hover:bg-[#f0f0f0] transition-colors">
            已保存文件
          </button>
        </div>
      </div>
      
      {/* 历史记录区域 */}
      <div className="p-4 border-t border-[#e5e5e5]">
        <h3 className="text-sm font-semibold text-[#666666] mb-2">历史记录</h3>
        <div className="space-y-2">
          {/* 历史记录列表 */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 