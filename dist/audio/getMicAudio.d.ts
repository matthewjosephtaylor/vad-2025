export declare const getMicAudio: (deviceId?: string) => Promise<{
    audioCtx: AudioContext;
    stream: MediaStream;
    analyserNode: AnalyserNode;
    mics: MediaDeviceInfo[];
}>;
