import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#0071e3] border-t-transparent"></div>
          <span className="text-[#1d1d1f] font-medium">正在处理...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading; 