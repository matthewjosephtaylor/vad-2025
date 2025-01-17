import { MicVAD, utils, type RealTimeVADOptions } from "@ricky0123/vad-web";

import type { env as ortEnv } from "onnxruntime-web";
import { getMicrophoneInput } from "./getMicrophoneInput";

export const startVad = async ({
  onSpeechStart,
  onSpeechEnd,
  options = {},
}: Partial<{
  onSpeechStart: () => void;
  onSpeechEnd: (wavAudio: ArrayBuffer) => void;
  options: Partial<RealTimeVADOptions>;
}> = {}) => {
  const { audioContext, source, stream } = await getMicrophoneInput();

  const { positiveSpeechThreshold = 0.9, ...rest } = options;

  // TODO load wasm and models from included binaries
  const vad = await MicVAD.new({
    // modelURL: based("vad/silero_vad.onnx"),
    // workletURL: based("vad/vad.worklet.bundle.min.js"),
    stream,

    positiveSpeechThreshold,
    ortConfig: (ort) => {
      console.log("startVad: ortConfig", ort);
      (ort.env as typeof ortEnv).wasm.numThreads = 1;
      // (ort.env as typeof ortEnv).wasm.wasmPaths = {
      //   "ort-wasm-simd.wasm": based("ort/ort-wasm-simd.wasm"),
      //   "ort-wasm.wasm": based("ort/ort-wasm.wasm"),
      //   "ort-wasm-simd-threaded.wasm": based("ort/ort-wasm-simd-threaded.wasm"),
      //   "ort-wasm-threaded.wasm": based("ort/ort-wasm-threaded.wasm"),
      // };
    },
    onSpeechStart: () => {
      onSpeechStart?.();
    },
    onSpeechEnd: async (audio) => {
      const wavBuffer = utils.encodeWAV(audio);
      onSpeechEnd?.(wavBuffer);
    },
    ...rest,
  });
  vad.start();
  return {
    audioContext,
    source,
    stream,
  };
};
