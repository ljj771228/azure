import React from 'react';

interface SettingsProps {
  pitch: number;
  rate: number;
  volume: number;
  onPitchChange: (value: number) => void;
  onRateChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  pitch,
  rate,
  volume,
  onPitchChange,
  onRateChange,
  onVolumeChange
}) => {
  return (
    <form 
      className="space-y-4 p-4 bg-[#fafafa] rounded-lg border border-[#e5e5e5]"
      onSubmit={(e) => e.preventDefault()}
    >
      <h3 className="text-sm font-semibold text-[#666666]" id="settings-title">语音设置</h3>
      
      {/* 音调设置 */}
      <div className="space-y-1" role="group" aria-labelledby="pitch-label">
        <div className="flex items-center justify-between">
          <label id="pitch-label" htmlFor="pitch-input" className="text-sm text-[#666666]">
            音调
          </label>
          <span className="text-sm text-[#999999]" aria-label={`当前音调值：${pitch}`}>
            {pitch}
          </span>
        </div>
        <input
          id="pitch-input"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => onPitchChange(parseFloat(e.target.value))}
          className="w-full accent-azure"
          aria-labelledby="pitch-label"
        />
      </div>

      {/* 语速设置 */}
      <div className="space-y-1" role="group" aria-labelledby="rate-label">
        <div className="flex items-center justify-between">
          <label id="rate-label" htmlFor="rate-input" className="text-sm text-[#666666]">
            语速
          </label>
          <span className="text-sm text-[#999999]" aria-label={`当前语速值：${rate}`}>
            {rate}
          </span>
        </div>
        <input
          id="rate-input"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => onRateChange(parseFloat(e.target.value))}
          className="w-full accent-azure"
          aria-labelledby="rate-label"
        />
      </div>

      {/* 音量设置 */}
      <div className="space-y-1" role="group" aria-labelledby="volume-label">
        <div className="flex items-center justify-between">
          <label id="volume-label" htmlFor="volume-input" className="text-sm text-[#666666]">
            音量
          </label>
          <span className="text-sm text-[#999999]" aria-label={`当前音量值：${volume}`}>
            {volume}
          </span>
        </div>
        <input
          id="volume-input"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full accent-azure"
          aria-labelledby="volume-label"
        />
      </div>
    </form>
  );
};

export default Settings; 