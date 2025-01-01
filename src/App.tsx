import { Button, CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./darkTheme";
import { getMicrophoneInput } from "./audio/getMicrophoneInput";
import { StartButton } from "./StartButton";
import PhonemeLevelsDisplay from "./debug/viseme/PhonemeLevelsDisplay";

export const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <h1>Hello VAD-2025</h1>
    <StartButton />
  </ThemeProvider>
);
