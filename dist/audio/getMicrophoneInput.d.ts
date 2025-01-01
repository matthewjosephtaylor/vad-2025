export declare function getMicrophoneInput(): Promise<{
    audioContext: AudioContext;
    source: MediaStreamAudioSourceNode;
    stream: MediaStream;
}>;
