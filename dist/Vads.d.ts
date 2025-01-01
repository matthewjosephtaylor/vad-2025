import { getMicrophoneInput } from './audio/getMicrophoneInput';
export declare const Vads: {
    startVad: () => Promise<void>;
    getMicAudio: (deviceId?: string) => Promise<{
        audioCtx: AudioContext;
        stream: MediaStream;
        analyserNode: AnalyserNode;
        mics: MediaDeviceInfo[];
    }>;
    getMicrophoneInput: typeof getMicrophoneInput;
    useMicAudio: (activate: boolean) => AnalyserNode | undefined;
};
