import React from 'react';

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = '处理中...' }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white p-4 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="mt-2 text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default Loading; 