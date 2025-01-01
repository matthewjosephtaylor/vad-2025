import Meyda, { MeydaFeaturesObject } from "meyda";
import type { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa";

// Define the type for phoneme levels
export type PhonemeLevels = {
  AA: number;
  EE: number;
  IH: number;
  OH: number;
  OU: number;
  W: number;
  UW: number;
  TH: number;
  T: number;
  SH: number;
  S: number;
  OW: number;
  M: number;
  L: number;
  K: number;
  IY: number;
  F: number;
  ER: number;
  EH: number;
  TONGUE_UP_DOWN: number;
  TONGUE_IN_OUT: number;
  MOUTH_WIDE_NARROW: number;
  MOUTH_OPEN: number;
};

// Initialize Meyda with a promise that resolves with the analyzer
export const initMeyda = (
  analyserNode: AnalyserNode,
  callback: (phonemeLevels: PhonemeLevels) => void
): MeydaAnalyzer => {
  const meydaAnalyzer = Meyda.createMeydaAnalyzer({
    audioContext: analyserNode.context,
    source: analyserNode,
    bufferSize: 512,
    featureExtractors: [
      "mfcc",
      "rms",
      "spectralCentroid",
      "spectralFlatness",
      "energy",
    ],
    // callback,
    callback: (features: Partial<MeydaFeaturesObject>) => {
      // Pass the features down to be processed as they are ready
      const phonemeLevels = calculatePhonemeLevels(features);
      callback(phonemeLevels);
    },
  });
  meydaAnalyzer.start();
  console.log("Meyda initialized");
  return meydaAnalyzer;
};

// Function to calculate phoneme levels based on Meyda features
export function calculatePhonemeLevels(
  features: Partial<MeydaFeaturesObject>
): PhonemeLevels {
  const { mfcc, rms, spectralCentroid } = features;

  return {
    AA: rms && mfcc ? Math.min(rms * (mfcc[0] || 0), 1) : 0, // Broad mouth opening
    EE: mfcc ? Math.min(mfcc[5] || 0, 1) : 0, // High frequency for EE
    IH: mfcc ? Math.min(mfcc[3] || 0, 1) : 0, // Mid-range frequency for IH
    OH: mfcc ? Math.min(mfcc[2] || 0, 1) : 0, // Lower mid-range for OH
    OU: mfcc ? Math.min((mfcc[0] + mfcc[5]) / 2, 1) : 0, // Combination for OU
    W: spectralCentroid ? (spectralCentroid > 1500 ? 1 : 0) : 0, // W (rounded)
    UW: spectralCentroid ? (spectralCentroid > 1000 ? 1 : 0) : 0, // UW
    TH: spectralCentroid ? (spectralCentroid > 2000 ? 1 : 0) : 0, // TH
    T: spectralCentroid ? (spectralCentroid > 2500 ? 1 : 0) : 0, // T
    SH: spectralCentroid ? (spectralCentroid > 5000 ? 1 : 0) : 0, // SH
    S: spectralCentroid ? (spectralCentroid > 4000 ? 1 : 0) : 0, // S
    OW: mfcc ? Math.min((mfcc[0] + mfcc[5]) / 2, 1) : 0, // OW
    M: rms && mfcc ? Math.min(rms * (mfcc[0] || 0), 1) : 0, // M (nasal)
    L: mfcc ? Math.min(mfcc[2] || 0, 1) : 0, // L (liquid sound)
    K: spectralCentroid ? (spectralCentroid > 3000 ? 1 : 0) : 0, // K
    IY: mfcc ? Math.min(mfcc[4] || 0, 1) : 0, // IY
    F: spectralCentroid ? (spectralCentroid > 6000 ? 1 : 0) : 0, // F
    ER: mfcc ? Math.min(mfcc[1] || 0, 1) : 0, // ER
    EH: mfcc ? Math.min(mfcc[2] || 0, 1) : 0, // EH
    TONGUE_UP_DOWN: mfcc ? Math.min(mfcc[6] || 0, 1) : 0, // Placeholder for tongue movement
    TONGUE_IN_OUT: spectralCentroid ? (spectralCentroid > 1500 ? 1 : 0) : 0, // Placeholder
    MOUTH_WIDE_NARROW: rms ? (rms > 0.5 ? 1 : 0) : 0, // Placeholder for mouth wide/narrow
    MOUTH_OPEN: rms ? (rms > 0.3 ? 1 : 0) : 0, // Placeholder for mouth open
  };
}
