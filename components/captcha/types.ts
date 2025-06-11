import { Dimensions } from "react-native";

export type Number = {
  id: number;
  x: number;
  y: number;
};

export enum ViewMode {
  CAPTCHA = "captcha",
  AUDIO = "audio",
  INFO = "info"
}

export const MAX_CANVAS_SIZE = 400;
export const NUMBER_RADIUS = 20;

// Calculate canvas dimensions
const { width } = Dimensions.get("window");
export const CANVAS_WIDTH = Math.min(width * 0.9, MAX_CANVAS_SIZE);
export const CANVAS_HEIGHT = CANVAS_WIDTH; 