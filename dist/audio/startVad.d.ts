import { RealTimeVADOptions } from '@ricky0123/vad-web';
export declare const startVad: ({ onSpeechStart, onSpeechEnd, options, }?: Partial<{
    onSpeechStart: () => void;
    onSpeechEnd: (wavAudio: ArrayBuffer) => void;
    options: Partial<RealTimeVADOptions>;
}>) => Promise<{
    audioContext: AudioContext;
    source: MediaStreamAudioSourceNode;
    stream: MediaStream;
}>;
