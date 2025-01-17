import { getMicrophoneInput } from './audio/getMicrophoneInput';
export declare const Vads: {
    startVad: ({ onSpeechStart, onSpeechEnd, options, }?: Partial<{
        onSpeechStart: () => void;
        onSpeechEnd: (wavAudio: ArrayBuffer) => void;
        options: Partial<import('@ricky0123/vad-web').RealTimeVADOptions>;
    }>) => Promise<{
        audioContext: AudioContext;
        source: MediaStreamAudioSourceNode;
        stream: MediaStream;
    }>;
    getMicAudio: (deviceId?: string) => Promise<{
        audioCtx: AudioContext;
        stream: MediaStream;
        analyserNode: AnalyserNode;
        mics: MediaDeviceInfo[];
    }>;
    getMicrophoneInput: typeof getMicrophoneInput;
    useMicAudio: (activate: boolean) => AnalyserNode | undefined;
};
