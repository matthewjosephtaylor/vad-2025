import { getMicAudio } from "./audio/getMicAudio";
import { getMicrophoneInput } from "./audio/getMicrophoneInput";
import { startVad } from "./audio/startVad";
import { useMicAudio } from "./audio/useMicAudio";

export const Vads = {
  startVad,
  getMicAudio,
  getMicrophoneInput,
  useMicAudio,
};
