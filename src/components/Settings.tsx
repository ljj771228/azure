import React from 'react';

interface SettingsProps {
  pitch: number;
  rate: number;
  volume: number;
  onPitchChange: (value: number) => void;
  onRateChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  pitch,
  rate,
  volume,
  onPitchChange,
  onRateChange,
  onVolumeChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-[#1d1d1f]">语音设置</h3>
      <div className="grid gap-6">
        {/* 音调设置 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="pitch" className="text-sm font-medium text-[#1d1d1f]">
              音调
            </label>
            <span className="text-sm text-[#86868b]">{pitch.toFixed(1)}</span>
          </div>
          <input
            type="range"
            id="pitch"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#d2d2d7] rounded-full appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-[#0071e3]
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-[#0071e3]
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:duration-200"
          />
        </div>

        {/* 语速设置 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="rate" className="text-sm font-medium text-[#1d1d1f]">
              语速
            </label>
            <span className="text-sm text-[#86868b]">{rate.toFixed(1)}</span>
          </div>
          <input
            type="range"
            id="rate"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#d2d2d7] rounded-full appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-[#0071e3]
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-[#0071e3]
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:duration-200"
          />
        </div>

        {/* 音量设置 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="volume" className="text-sm font-medium text-[#1d1d1f]">
              音量
            </label>
            <span className="text-sm text-[#86868b]">{(volume * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#d2d2d7] rounded-full appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-[#0071e3]
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-[#0071e3]
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings; 