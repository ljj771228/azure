import { azureConfig } from '../config/azure';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

interface SpeechSynthesisResult {
  audioData: ArrayBuffer;
  audioDuration?: number;
}

interface SpeechSettings {
  pitch: number;
  rate: number;
  volume: number;
}

// 语音合成事件类型
interface SynthesisEvent {
  result?: SpeechSynthesisResult;
  errorDetails?: string;
  reason?: string;
}

class AzureVoiceService {
  private speechConfig: sdk.SpeechConfig;
  private currentVoice: string;
  private settings: Required<SpeechSettings>;

  constructor() {
    try {
      // 验证配置
      if (!azureConfig.subscriptionKey || !azureConfig.region) {
        throw new Error('Azure configuration is missing. Please check your .env file.');
      }

      console.log('Initializing Azure Speech Service with:', {
        region: azureConfig.region,
        hasKey: !!azureConfig.subscriptionKey,
        defaultVoice: azureConfig.defaultVoice
      });

      this.speechConfig = sdk.SpeechConfig.fromSubscription(
        azureConfig.subscriptionKey,
        azureConfig.region
      );

      // 设置默认配置
      this.currentVoice = azureConfig.defaultVoice;
      this.speechConfig.speechRecognitionLanguage = azureConfig.defaultRecognitionLanguage;
      this.speechConfig.speechSynthesisLanguage = azureConfig.defaultLanguage;
      this.speechConfig.speechSynthesisVoiceName = this.currentVoice;
      
      // 设置输出格式
      this.speechConfig.setProperty(sdk.PropertyId.SpeechServiceResponse_RequestSentenceBoundary, "true");
      this.speechConfig.setProperty(sdk.PropertyId.SpeechServiceResponse_OutputFormatOption, "Detailed");
      
      // 设置连接超时
      this.speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
        "5000"
      );
      this.speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
        "5000"
      );

      // 设置重试策略
      this.speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_ReconnectOnError,
        "true"
      );

      // 设置日志级别
      this.speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps,
        "true"
      );

      // 设置音频输出格式
      this.speechConfig.outputFormat = sdk.OutputFormat.Detailed;
      
      this.settings = {
        pitch: 1,
        rate: 1,
        volume: 1
      };

      console.log('Azure Speech Service initialized with:', {
        voice: this.currentVoice,
        recognitionLanguage: this.speechConfig.speechRecognitionLanguage,
        synthesisLanguage: this.speechConfig.speechSynthesisLanguage,
        region: azureConfig.region,
        outputFormat: this.speechConfig.outputFormat
      });
    } catch (error) {
      console.error('Failed to initialize Azure Speech Service:', error);
      throw error;
    }
  }

  // 设置语音
  setVoice(voiceName: string): void {
    if (!voiceName) {
      console.error('Invalid voice name');
      return;
    }
    try {
      console.log('Setting voice to:', voiceName);
      this.currentVoice = voiceName;
      this.speechConfig.speechSynthesisVoiceName = voiceName;
    } catch (error) {
      console.error('Failed to set voice:', error);
      throw new Error('设置语音失败');
    }
  }

  // 设置语音参数
  setSettings(settings: Partial<SpeechSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  // 文字转语音
  async textToSpeech(text: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      try {
        if (!this.currentVoice) {
          throw new Error('请先选择语音');
        }

        if (!text.trim()) {
          throw new Error('请输入要转换的文本');
        }

        const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig);

        // 修改 SSML 格式
        const ssml = `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
            <voice name="${this.currentVoice}">
              <prosody 
                pitch="${this.settings.pitch > 1 ? '+' : ''}${Math.floor((this.settings.pitch - 1) * 50)}%" 
                rate="${this.settings.rate.toFixed(1)}" 
                volume="${Math.floor(this.settings.volume * 100)}%"
              >
                ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
              </prosody>
            </voice>
          </speak>
        `.trim().replace(/\s+/g, ' ');

        // 添加事件监听器
        synthesizer.synthesisStarted = (_s: unknown, _e: SynthesisEvent) => {
          console.log('Synthesis started');
        };

        synthesizer.synthesizing = (_s: unknown, e: SynthesisEvent) => {
          console.log('Synthesizing...', e);
        };

        synthesizer.synthesisCompleted = (_s: unknown, e: SynthesisEvent) => {
          console.log('Synthesis completed', e);
        };

        synthesizer.canceled = (_s: unknown, e: SynthesisEvent) => {
          const errorMessage = e.errorDetails 
            ? `语音合成取消: ${e.errorDetails}`
            : '语音合成取消：未知错误';
          console.error('Synthesis canceled:', {
            reason: e.reason,
            errorDetails: e.errorDetails
          });
          reject(new Error(errorMessage));
          synthesizer.close();
        };

        // 执行语音合成
        synthesizer.speakSsmlAsync(
          ssml,
          (result: SpeechSynthesisResult) => {
            try {
              if (result.audioData && result.audioData.byteLength > 0) {
                console.log('Synthesis succeeded:', {
                  audioLength: result.audioData.byteLength,
                  audioDuration: result.audioDuration
                });
                resolve(result.audioData);
              } else {
                throw new Error('未收到音频数据');
              }
            } catch (error) {
              console.error('Error processing synthesis result:', error);
              reject(new Error('处理语音合成结果时出错'));
            } finally {
              synthesizer.close();
            }
          },
          (error: Error) => {
            console.error('Synthesis failed:', error);
            reject(new Error(`语音合成失败: ${error.message || '未知错误'}`));
            synthesizer.close();
          }
        );
      } catch (error) {
        console.error('Failed to start synthesis:', error);
        reject(error instanceof Error ? error : new Error('语音合成失败'));
      }
    });
  }

  // 获取可用的语音列表
  async getVoices(): Promise<sdk.VoiceInfo[]> {
    try {
      // 使用 REST API 获取语音列表
      const response = await fetch(
        `https://${azureConfig.region}.tts.speech.microsoft.com/cognitiveservices/voices/list`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': azureConfig.subscriptionKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const voices = await response.json();
      
      // 过滤和转换语音列表
      const filteredVoices = voices
        .filter((voice: any) => {
          return voice.Locale?.toLowerCase().startsWith('zh-');
        })
        .map((voice: any) => ({
          name: voice.Name,
          locale: voice.Locale,
          localName: voice.LocalName || voice.Name,
          gender: voice.Gender,
          voiceType: voice.VoiceType,
          status: voice.Status,
          shortName: voice.ShortName
        }))
        .sort((a: any, b: any) => {
          if (a.locale !== b.locale) {
            return a.locale.localeCompare(b.locale);
          }
          return a.localName.localeCompare(b.localName);
        });

      console.log('Retrieved and filtered voices:', {
        total: voices.length,
        filtered: filteredVoices.length,
        voices: filteredVoices.map((v: any) => ({
          name: v.name,
          locale: v.locale,
          localName: v.localName
        }))
      });

      return filteredVoices as sdk.VoiceInfo[];
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      throw new Error('获取语音列表失败');
    }
  }
}

export const azureVoiceService = new AzureVoiceService(); 