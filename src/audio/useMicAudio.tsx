import React, { useEffect } from "react";
import { getMicAudio } from "./getMicAudio";

export const useMicAudio = (activate: boolean) => {
  const [state, setState] = React.useState({
    analyserNode: undefined as undefined | AnalyserNode,
  });
  useEffect(() => {
    if (activate && !state.analyserNode) {
      getMicAudio(
        // "e18767886adb9583a29268deeae90b9e36fcfb273504d3a9893f40d604aa6c71"
      ).then(({ analyserNode }) => {
        setState((s) => ({ ...s, analyserNode }));
      });
    }
  }, [activate]);
  return state.analyserNode;
};
