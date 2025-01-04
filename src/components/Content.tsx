import React, { useState, useRef } from 'react';
import { azureVoiceService } from '../services/AzureVoiceService';
import Toast from './Toast';
import Loading from './Loading';
import Select from './Select';
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk';
import Settings from './Settings';

const Content: React.FC<{ className?: string }> = ({ className }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [settings, setSettings] = useState({
    pitch: 1,
    rate: 1,
    volume: 1
  });

  // 加载可用的语音列表
  React.useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsProcessing(true);
        const voiceList = await azureVoiceService.getVoices();
        // 只保留中文语音
        const chineseVoices = voiceList.filter(voice => 
          voice.locale.startsWith('zh-')
        );
        setVoices(chineseVoices);
        
        // 设置默认语音
        if (chineseVoices.length > 0) {
          setSelectedVoice(chineseVoices[0].name);
          azureVoiceService.setVoice(chineseVoices[0].name);
        }
      } catch (error) {
        console.error('获取语音列表失败:', error);
        setError('获取语音列表失败');
      } finally {
        setIsProcessing(false);
      }
    };

    loadVoices();
  }, []);

  // 处理文字转语音
  const handleTextToSpeech = async () => {
    try {
      if (!text.trim()) {
        setError('请输入要转换的文本');
        return;
      }

      setIsProcessing(true);
      setError(null);

      // 更新语音设置
      azureVoiceService.setSettings(settings);

      // 执行转换
      const audioData = await azureVoiceService.textToSpeech(text);
      
      // 创建音频 URL
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      // 更新音频源
      setAudioUrl(url);

      // 如果存在旧的音频 URL，释放它
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

    } catch (error) {
      console.error('转换失败:', error);
      setError(error instanceof Error ? error.message : '转换失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className={`max-w-3xl mx-auto p-8 ${className || ''}`}>
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-medium text-[#1d1d1f] mb-2">晓鸥能源语音助手</h1>
          <p className="text-[#86868b]">将文字转换为自然的语音</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* 语音选择 */}
            <div className="space-y-3">
              <label htmlFor="voice-select" className="block text-sm font-medium text-[#1d1d1f]">
                选择语音
              </label>
              <Select
                id="voice-select"
                value={selectedVoice}
                onChange={(value) => {
                  setSelectedVoice(value);
                  azureVoiceService.setVoice(value);
                }}
                options={voices.map(voice => ({
                  value: voice.name,
                  label: `${voice.localName || voice.name} (${voice.locale})`
                }))}
                className="w-full bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
              />
            </div>

            {/* 语音设置 */}
            <Settings
              pitch={settings.pitch}
              rate={settings.rate}
              volume={settings.volume}
              onPitchChange={(value) => setSettings(prev => ({ ...prev, pitch: value }))}
              onRateChange={(value) => setSettings(prev => ({ ...prev, rate: value }))}
              onVolumeChange={(value) => setSettings(prev => ({ ...prev, volume: value }))}
            />

            {/* 文本区域 */}
            <div className="space-y-4">
              <textarea
                id="text-input"
                name="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 p-4 bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] 
                          placeholder-[#86868b] resize-none focus:ring-2 focus:ring-[#0071e3]
                          transition-all duration-200"
                placeholder="请输入要转换的文本..."
              />
              <button
                type="button"
                className="w-full py-3 px-6 bg-[#0071e3] text-white rounded-xl font-medium
                         hover:bg-[#0077ED] active:bg-[#006EDB] disabled:opacity-50
                         transition-all duration-200 transform hover:scale-[1.02]
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071e3]"
                onClick={handleTextToSpeech}
                disabled={!text || isProcessing}
              >
                {isProcessing ? '正在转换...' : '转换为语音'}
              </button>
            </div>

            {/* 音频播放器 */}
            {audioUrl && (
              <div className="mt-6 p-6 bg-[#f5f5f7] rounded-xl">
                <audio 
                  ref={audioRef} 
                  src={audioUrl} 
                  controls 
                  className="w-full focus:outline-none"
                  title="合成的语音"
                />
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 加载指示器 */}
      {isProcessing && <Loading />}

      {/* 错误提示 */}
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default Content; 