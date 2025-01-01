export const getMicAudio = async (deviceId?: string) => {
  const audioCtx = new AudioContext();

  // Ensure the AudioContext is running (especially in browsers like Chrome)
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
    console.log("Audio context resumed after user gesture.");
  }

  // List available microphone devices
  const devices = await navigator.mediaDevices.enumerateDevices();
  const mics = devices.filter(device => device.kind === 'audioinput');
  console.log("Available microphones:", mics);

  // If no deviceId is passed, default to the first microphone
  const selectedDeviceId = deviceId || mics[0]?.deviceId;

  if (!selectedDeviceId) {
    throw new Error("No microphone devices available");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: { exact: selectedDeviceId }
    }
  });
  console.log("Audio stream captured from microphone:", stream);

  // Create MediaStreamSource and AnalyserNode
  const source = audioCtx.createMediaStreamSource(stream);
  const analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 2048; // Adjust FFT size for frequency resolution
  source.connect(analyserNode);

  return { audioCtx, stream, analyserNode, mics }; // Return mics list for potential UI rendering
};
