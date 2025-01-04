import React, { useState, useRef, useEffect, PropsWithChildren } from 'react';
import { azureVoiceService } from '../services/AzureVoiceService';
import Toast from './Toast';
import Loading from './Loading';
import Select from './Select';
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk';
import Settings from './Settings';

const Content: React.FC<PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [settings, setSettings] = useState({
    pitch: 1,
    rate: 1,
    volume: 1
  });

  // 加载可用的语音列表
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsProcessing(true);
        const voiceList = await azureVoiceService.getVoices();
        // 只保留中文语音
        const chineseVoices = voiceList.filter(voice => 
          voice.locale.startsWith('zh-')
        );
        console.log('Chinese voices:', chineseVoices);
        setVoices(chineseVoices);
        
        // 设置默认语音
        if (chineseVoices.length > 0) {
          const defaultVoice = chineseVoices[0];
          console.log('Setting default voice:', defaultVoice);
          setSelectedVoice(defaultVoice.name);
          azureVoiceService.setVoice(defaultVoice.name);
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

  // 验证音频文件
  const validateAudioFile = (file: File): boolean => {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      setError('请选择有效的音频文件 (WAV, MP3, OGG)');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('文件大小不能超过 10MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = async (file: File) => {
    if (!validateAudioFile(file)) return;
    
    try {
      setIsProcessing(true);
      const recognizedText = await azureVoiceService.speechToText(file);
      setText(recognizedText);
    } catch (error: unknown) {
      console.error('语音识别失败:', error);
      setError(error instanceof Error ? error.message : '语音识别失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    if (!voiceName) return;
    console.log('Changing voice to:', voiceName);
    setSelectedVoice(voiceName);
    azureVoiceService.setVoice(voiceName);
  };

  const handleTextToSpeech = async () => {
    if (!text) return;
    
    try {
      setIsProcessing(true);
      console.log('Converting text to speech:', text);
      console.log('Selected voice:', selectedVoice);
      
      const audioData = await azureVoiceService.textToSpeech(text);
      const blob = new Blob([audioData], { type: 'audio/wav' });
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.load(); // 重新加载音频
        audioRef.current.play();
      }
    } catch (error) {
      console.error('语音合成失败:', error);
      setError('语音合成失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理设置变更
  const handleSettingsChange = (key: keyof typeof settings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    azureVoiceService.setSettings(newSettings);
  };

  // 在组件卸载时清理 URL
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // 在 useEffect 中添加配置检查
  useEffect(() => {
    const checkConfig = async () => {
      try {
        // 测试语音服务连接
        const voices = await azureVoiceService.getVoices();
        if (!voices || voices.length === 0) {
          throw new Error('No voices available');
        }
        console.log('Azure service connection test successful');
      } catch (error) {
        console.error('Azure service connection test failed:', error);
        setError('Azure 服务连接失败，请检查配置');
      }
    };

    checkConfig();
  }, []);

  return (
    <div className={`p-6 relative ${className}`}>
      {isProcessing && <Loading />}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      
      <div className="max-w-4xl mx-auto space-y-4">
        {/* 设置面板 */}
        <Settings
          {...settings}
          onPitchChange={(value) => handleSettingsChange('pitch', value)}
          onRateChange={(value) => handleSettingsChange('rate', value)}
          onVolumeChange={(value) => handleSettingsChange('volume', value)}
        />

        {/* 主要内容面板 */}
        <form 
          className="bg-white rounded-lg shadow-sm border border-[#e5e5e5] p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-4">
            {/* 语音选择 */}
            <div className="flex items-center space-x-2">
              <label htmlFor="voice-select" className="text-sm text-[#666666]">
                选择语音：
              </label>
              <Select
                id="voice-select"
                name="voice-select"
                value={selectedVoice}
                onChange={handleVoiceChange}
                options={voices.map(voice => ({
                  value: voice.name,
                  label: `${voice.localName || voice.name} (${voice.locale})`
                }))}
                placeholder="请选择语音"
                className="flex-1"
              />
            </div>

            {/* 拖放区域 */}
            <div
              role="button"
              tabIndex={0}
              aria-label="拖放音频文件或点击选择文件"
              className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-[#e5e5e5] rounded-lg bg-[#fafafa] hover:bg-[#f5f5f5] transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
            >
              <p className="text-[#666666]">
                {isProcessing ? '处理中...' : '拖放音频文件到这里，或点击选择文件'}
              </p>
              <p className="text-[#999999] text-sm mt-1">
                支持的格式：WAV, MP3, OGG (最大 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                id="audio-file"
                name="audio-file"
                accept="audio/wav,audio/mp3,audio/mpeg,audio/ogg"
                onChange={handleFileInput}
                className="hidden"
                aria-label="选择音频文件"
              />
              <button
                type="button"
                className="mt-4 px-6 py-2 bg-[#007AFF] text-white rounded-md hover:bg-[#0066FF] transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                选择文件
              </button>
            </div>

            {/* 文本区域 */}
            <div className="space-y-2">
              <label htmlFor="text-input" className="sr-only">文本输入</label>
              <textarea
                id="text-input"
                name="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 p-3 rounded-md border border-[#e5e5e5] bg-white text-[#333333] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]"
                placeholder="识别的文本将显示在这里..."
              />
              <button
                type="button"
                className="w-full py-2 bg-[#007AFF] text-white rounded-md hover:bg-[#0066FF] transition-colors disabled:opacity-50 disabled:hover:bg-[#007AFF]"
                onClick={handleTextToSpeech}
                disabled={!text || isProcessing}
              >
                转换为语音
              </button>
            </div>

            {/* 音频播放器 */}
            {audioUrl && (
              <div className="flex items-center justify-between p-4 bg-[#fafafa] rounded-lg border border-[#e5e5e5]">
                <audio 
                  ref={audioRef} 
                  src={audioUrl} 
                  controls 
                  className="w-full"
                  title="合成的语音"
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Content; 