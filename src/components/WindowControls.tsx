import React from 'react';

export const WindowControls: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <button className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4b4b]" />
      <button className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffb01f]" />
      <button className="w-3 h-3 rounded-full bg-[#28c940] hover:bg-[#24b238]" />
    </div>
  );
};

export default WindowControls; 