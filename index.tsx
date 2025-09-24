/* tslint:disable */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, LiveServerMessage, Modality, Session} from '@google/genai';
import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {createBlob, decode, decodeAudioData} from './utils';
import './visual-3d';
import './src/audio2face-visualizer';
import {ThemeManager} from './src/theme-manager.js';

@customElement('gdm-live-audio')
export class GdmLiveAudio extends LitElement {
  @state() isRecording = false;
  @state() status = '';
  @state() error = '';
  @state() sensitivity = 1.0;
  @state() theme = 'neon';
  @state() audioAnalyser: any = null;
  @state() lastAudioData: ArrayBuffer | null = null;

  private client: GoogleGenAI;
  private session: Session;
  private inputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 16000});
  private outputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 24000});
  @state() inputNode = this.inputAudioContext.createGain();
  @state() outputNode = this.outputAudioContext.createGain();
  private nextStartTime = 0;
  private mediaStream: MediaStream;
  private sourceNode: AudioBufferSourceNode;
  private scriptProcessorNode: ScriptProcessorNode;
  private sources = new Set<AudioBufferSourceNode>();

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif);
    }
    
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 2rem 0;
      text-align: center;
      background: linear-gradient(45deg, var(--accent-color, #64b5f6), var(--text-primary, #ffffff));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: fadeIn 0.8s ease-out;
    }
    
    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      justify-content: center;
      animation: slideIn 0.6s ease-out 0.2s both;
    }
    
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--glass-bg, rgba(255, 255, 255, 0.1));
      color: var(--text-primary, #ffffff);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: var(--shadow, 0 8px 32px rgba(0, 0, 0, 0.3));
    }
    
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover, 0 12px 40px rgba(0, 0, 0, 0.4));
      background: rgba(255, 255, 255, 0.2);
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    .record-button {
      position: relative;
      overflow: hidden;
    }
    
    .record-button.recording {
      background: linear-gradient(45deg, #ff4444, #cc0000);
      animation: pulse 1.5s infinite;
    }
    
    .record-button.recording::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      animation: ripple 2s infinite;
    }
    
    .sensitivity-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--glass-bg, rgba(255, 255, 255, 0.1));
      padding: 0.5rem 1rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .sensitivity-control label {
      font-size: 0.9rem;
      color: var(--text-secondary, #b0b0b0);
      font-weight: 500;
    }
    
    .sensitivity-control input[type="range"] {
      width: 100px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      outline: none;
      -webkit-appearance: none;
    }
    
    .sensitivity-control input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: var(--accent-color, #64b5f6);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }
    
    .sensitivity-control span {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
      min-width: 30px;
    }
    
    .status {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      animation: fadeIn 0.8s ease-out 0.4s both;
    }
    
    .status span {
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 8px;
      background: var(--glass-bg, rgba(255, 255, 255, 0.1));
    }
    
    .status-recording {
      color: #ff4444;
      background: rgba(255, 68, 68, 0.2);
    }
    
    .status-processing {
      color: #ffa500;
      background: rgba(255, 165, 0, 0.2);
    }
    
    .status-ready {
      color: #4caf50;
      background: rgba(76, 175, 80, 0.2);
    }
    
    .error {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 1px solid rgba(244, 67, 54, 0.3);
      animation: fadeIn 0.5s ease-out;
    }
    
    .visualizers-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 20px;
      height: 50vh;
      width: 100%;
      max-width: 1200px;
      animation: fadeIn 0.8s ease-out 0.6s both;
    }
    
    @keyframes ripple {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }
      
      h1 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
      }
      
      .controls {
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      
      button {
        padding: 10px 20px;
        font-size: 0.9rem;
      }
      
      .visualizers-container {
        grid-template-columns: 1fr;
        height: 70vh;
        gap: 15px;
        padding: 15px;
      }
      
      .sensitivity-control {
        width: 100%;
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      h1 {
        font-size: 1.5rem;
      }
      
      .visualizers-container {
        height: 60vh;
        gap: 10px;
        padding: 10px;
      }
    }
  `;

  constructor() {
    super();
    this.initClient();
  }

  private initAudio() {
    this.nextStartTime = this.outputAudioContext.currentTime;
  }

  private async initClient() {
    this.initAudio();

    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    this.outputNode.connect(this.outputAudioContext.destination);

    this.initSession();
  }

  private async initSession() {
    const model = 'gemini-2.5-flash-preview-native-audio-dialog';

    try {
      this.session = await this.client.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            this.updateStatus('Opened');
          },
          onmessage: async (message: LiveServerMessage) => {
            const audio =
              message.serverContent?.modelTurn?.parts[0]?.inlineData;

            if (audio) {
              this.nextStartTime = Math.max(
                this.nextStartTime,
                this.outputAudioContext.currentTime,
              );

              const audioBuffer = await decodeAudioData(
                decode(audio.data),
                this.outputAudioContext,
                24000,
                1,
              );
              const source = this.outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputNode);
              source.addEventListener('ended', () =>{
                this.sources.delete(source);
              });

              source.start(this.nextStartTime);
              this.nextStartTime = this.nextStartTime + audioBuffer.duration;
              this.sources.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if(interrupted) {
              for(const source of this.sources.values()) {
                source.stop();
                this.sources.delete(source);
              }
              this.nextStartTime = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            this.updateError(e.message);
          },
          onclose: (e: CloseEvent) => {
            this.updateStatus('Close:' + e.reason);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Orus'}},
            // languageCode: 'en-GB'
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  private updateStatus(msg: string) {
    this.status = msg;
  }

  private updateError(msg: string) {
    this.error = msg;
  }

  private async startRecording() {
    if (this.isRecording) {
      return;
    }

    this.inputAudioContext.resume();

    this.updateStatus('Requesting microphone access...');

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      this.updateStatus('Microphone access granted. Starting capture...');

      this.sourceNode = this.inputAudioContext.createMediaStreamSource(
        this.mediaStream,
      );
      this.sourceNode.connect(this.inputNode);

      const bufferSize = 256;
      this.scriptProcessorNode = this.inputAudioContext.createScriptProcessor(
        bufferSize,
        1,
        1,
      );

      this.scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
        if (!this.isRecording) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);

        this.session.sendRealtimeInput({media: createBlob(pcmData)});
      };

      this.sourceNode.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.inputAudioContext.destination);

      this.isRecording = true;
      this.updateStatus('🔴 Recording... Capturing PCM chunks.');
    } catch (err) {
      console.error('Error starting recording:', err);
      this.updateStatus(`Error: ${err.message}`);
      this.stopRecording();
    }
  }

  private stopRecording() {
    if (!this.isRecording && !this.mediaStream && !this.inputAudioContext)
      return;

    this.updateStatus('Stopping recording...');

    this.isRecording = false;

    if (this.scriptProcessorNode && this.sourceNode && this.inputAudioContext) {
      this.scriptProcessorNode.disconnect();
      this.sourceNode.disconnect();
    }

    this.scriptProcessorNode = null;
    this.sourceNode = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.updateStatus('Recording stopped. Click Start to begin again.');
    
    // Store last audio data for playback
    if (this.session) {
      // This is a simplified approach - in a real app you'd capture the actual audio data
      this.lastAudioData = new ArrayBuffer(1024);
    }
  }

  private createAudioAnalyser() {
    const analyser = this.inputAudioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    this.inputNode.connect(analyser);
    
    return {
      getFrequencyData: () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        return dataArray;
      }
    };
  }

  private reset() {
    this.session?.close();
    this.initSession();
    this.updateStatus('Session cleared.');
  }

  private toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private async playLastAudio() {
    if (!this.lastAudioData) return;
    
    // Convert ArrayBuffer to Uint8Array for decodeAudioData
    const uint8Array = new Uint8Array(this.lastAudioData);
    const audioBuffer = await decodeAudioData(
      uint8Array,
      this.outputAudioContext,
      24000,
      1,
    );
    const source = this.outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.outputNode);
    source.start();
  }

  render() {
    return html`
      <div class="container">
        <h1>🎙️ Live Audio Experience</h1>
        
        <div class="controls">
          <button
            class="record-button ${this.isRecording ? 'recording' : ''}"
            @click=${this.toggleRecording}
            ?disabled=${this.status === 'processing'}
            title="${this.isRecording ? 'Stop Recording' : 'Start Recording'}"
          >
            ${this.isRecording ? '⏹️ Stop' : '🔴 Record'}
          </button>
          <button
            @click=${this.playLastAudio}
            ?disabled=${!this.lastAudioData || this.isRecording}
            title="Playback Audio"
          >
            ▶️ Play
          </button>
          <div class="sensitivity-control">
            <label>Sensitivity:</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              .value=${this.sensitivity}
              @input=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                this.sensitivity = parseFloat(target.value);
              }}
            />
            <span>${this.sensitivity.toFixed(1)}</span>
          </div>
        </div>
        
        <div class="status">
          Status: <span class="status-${this.status}">${this.status}</span>
        </div>
        
        ${this.error ? html`<div class="error">⚠️ ${this.error}</div>` : ''}
        
        <div class="visualizers-container">
          <gdm-live-audio-visuals-3d
            .audioAnalyser=${this.audioAnalyser}
            .sensitivity=${this.sensitivity}
            .theme=${this.theme}
          ></gdm-live-audio-visuals-3d>
          <audio2face-visualizer
            .audioAnalyser=${this.createAudioAnalyser()}
            .sensitivity=${this.sensitivity}
            .theme=${this.theme}
          ></audio2face-visualizer>
        </div>
        
        <gdm-theme-manager
          .theme=${this.theme}
          @theme-changed=${(e: CustomEvent) => {
            this.theme = e.detail.theme;
          }}
        ></gdm-theme-manager>
      </div>
    `;
  }
}
