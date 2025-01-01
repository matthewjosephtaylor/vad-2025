import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useMicAudio } from "./audio/useMicAudio";
import PhonemeLevelsDisplay from "./debug/viseme/PhonemeLevelsDisplay";

export const StartButton = () => {
  const [active, setActive] = useState(true);
  const analyserNode = useMicAudio(active);
  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          console.log("Start button clicked");
          setActive((a) => !a);
          // getMicrophoneInput();
          // startVad();
        }}
      >
        Start
      </Button>
      <PhonemeLevelsDisplay analyserNode={analyserNode} />
    </Stack>
  );
};
