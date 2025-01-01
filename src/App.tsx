import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./darkTheme";
import { StartButton } from "./StartButton";

export const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <h1>Hello VAD-2025</h1>
    <StartButton />
  </ThemeProvider>
);
