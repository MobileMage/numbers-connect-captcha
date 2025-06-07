type Point = {
  x: number;
  y: number;
};

type Shape = {
  points: Point[];
  count: number;
};

type Shapes = {
  [key: string]: Shape;
};

const shapes: Shapes = {


  star: {
    points: [
      { x: 0.5, y: 0.1 }, // top point
      { x: 0.6, y: 0.35 }, // top right inner
      { x: 0.9, y: 0.35 }, // right point
      { x: 0.7, y: 0.55 }, // bottom right inner
      { x: 0.8, y: 0.85 }, // bottom right point
      { x: 0.5, y: 0.7 }, // bottom inner
      { x: 0.2, y: 0.85 }, // bottom left point
      { x: 0.3, y: 0.55 }, // bottom left inner
      { x: 0.1, y: 0.35 }, // left point
      { x: 0.4, y: 0.35 }, // top left inner
    ],
    count: 10,
  },

  infinity: {
    points: [
      { x: 0.25, y: 0.5 }, // left center
      { x: 0.15, y: 0.3 }, // left top
      { x: 0.35, y: 0.2 }, // left-center top
      { x: 0.5, y: 0.5 }, // center crossing
      { x: 0.65, y: 0.8 }, // right-center bottom
      { x: 0.85, y: 0.7 }, // right bottom
      { x: 0.75, y: 0.5 }, // right center
      { x: 0.85, y: 0.3 }, // right top
      { x: 0.65, y: 0.2 }, // right-center top
      { x: 0.35, y: 0.8 }, // left-center bottom
      { x: 0.15, y: 0.7 }, // left bottom
    ],
    count: 11,
  },

  arrow: {
    points: [
      { x: 0.8, y: 0.5 }, // arrow tip
      { x: 0.6, y: 0.3 }, // top arrow head
      { x: 0.6, y: 0.4 }, // top arrow neck
      { x: 0.2, y: 0.4 }, // top shaft
      { x: 0.2, y: 0.6 }, // bottom shaft
      { x: 0.6, y: 0.6 }, // bottom arrow neck
      { x: 0.6, y: 0.7 }, // bottom arrow head
    ],
    count: 7,
  },

  wave: {
    points: [
      { x: 0.1, y: 0.5 }, // start
      { x: 0.2, y: 0.3 }, // first peak
      { x: 0.3, y: 0.5 }, // first valley
      { x: 0.4, y: 0.7 }, // second trough
      { x: 0.5, y: 0.5 }, // middle
      { x: 0.6, y: 0.3 }, // third peak
      { x: 0.7, y: 0.5 }, // third valley
      { x: 0.8, y: 0.7 }, // fourth trough
      { x: 0.9, y: 0.5 }, // end
    ],
    count: 9,
  },

  crown: {
    points: [
      { x: 0.15, y: 0.8 }, // point 1 - left base
      { x: 0.25, y: 0.4 }, // point 2 - left peak
      { x: 0.35, y: 0.65 }, // point 3 - first valley
      { x: 0.45, y: 0.2 }, // point 4 - center peak (tallest)
      { x: 0.55, y: 0.65 }, // point 5 - second valley
      { x: 0.65, y: 0.25 }, // point 6 - right peak
      { x: 0.85, y: 0.8 }, // point 7 - right base
      { x: 0.1, y: 0.9 }, // point 8 - back to start (closes the shape)
    ],
    count: 8,
  }
};

export default shapes;
