import shapes from "@/constants/Shapes";
import { CANVAS_HEIGHT, CANVAS_WIDTH, NUMBER_RADIUS, Number } from "./types";

export const generateNumbers = (): Number[] => {
  const shapeKeys = Object.keys(shapes);
  const randomShapeKey =
    shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
  const shape = shapes[randomShapeKey];

  const numbers: Number[] = [];
  const margin = NUMBER_RADIUS * 2;
  const jitter = 0.05;

  for (let i = 0; i < shape.count; i++) {
    const point = shape.points[i];
    const randomXJitter = (Math.random() - 0.5) * jitter;
    const randomYJitter = (Math.random() - 0.5) * jitter;

    const x = (point.x + randomXJitter) * (CANVAS_WIDTH - margin * 2) + margin;
    const y = (point.y + randomYJitter) * (CANVAS_HEIGHT - margin * 2) + margin;

    numbers.push({ id: i + 1, x, y });
  }
  return numbers;
};

export const checkCollision = (
  x: number,
  y: number,
  numbers: Number[]
): Number | null => {
  for (const num of numbers) {
    const distance = Math.hypot(num.x - x, num.y - y);
    if (distance < NUMBER_RADIUS) {
      return num;
    }
  }
  return null;
};

export const removeDuplicates = (arr: number[]) => {
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
};
