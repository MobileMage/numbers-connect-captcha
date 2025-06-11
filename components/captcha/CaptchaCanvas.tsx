import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, SharedValue, FadeInDown, SlideOutDown, FadeOutUp } from "react-native-reanimated";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import AnimatedDrawnPath from "./AnimatedDrawnPath";
import { CANVAS_HEIGHT, CANVAS_WIDTH, Number } from "./types";

type CaptchaCanvasProps = {
  numbers: Number[];
  path: string;
  livePath: string;
  pathColor: string;
  isVerifying: boolean;
  textColor: string;
  borderColor: string;
  animationProgress: SharedValue<number>;
  onTouchStart: (x: number, y: number) => void;
  onTouchMove: (x: number, y: number) => void;
  onTouchEnd: () => void;
};

const CaptchaCanvas = ({
  numbers,
  path,
  livePath,
  pathColor,
  isVerifying,
  textColor,
  borderColor,
  animationProgress,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: CaptchaCanvasProps) => {
  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onStart((event) => {
      runOnJS(onTouchStart)(event.x, event.y);
    })
    .onUpdate((event) => {
      runOnJS(onTouchMove)(event.x, event.y);
    })
    .onEnd(() => {
      runOnJS(onTouchEnd)();
    })
    .shouldCancelWhenOutside(false)
    .enabled(!isVerifying);

  const gridDots = useMemo(() => {
    const dots = [];
    const gridSize = 30;
    for (let i = gridSize; i < CANVAS_WIDTH; i += gridSize) {
      for (let j = gridSize; j < CANVAS_HEIGHT; j += gridSize) {
        dots.push({ x: i, y: j });
      }
    }
    return dots;
  }, []);

  return (
    <Animated.View entering={
      FadeInDown
    } exiting={
      FadeOutUp
    } style={[styles.canvasContainer, { borderColor }]}>
      <GestureDetector gesture={panGesture}>
        <Svg height={CANVAS_HEIGHT} width={CANVAS_WIDTH}>
          {/* Show animated path during verification, regular path otherwise */}
          {isVerifying && path + livePath ? (
            <AnimatedDrawnPath
              path={path + livePath}
              color={pathColor}
              progress={animationProgress}
              strokeWidth={2.5}
            />
          ) : (
            <>
              <Path
                d={path}
                stroke={pathColor}
                strokeWidth="2.5"
                fill="none"
              />
              <Path
                d={livePath}
                stroke={pathColor}
                strokeWidth="2.5"
                fill="none"
              />
            </>
          )}

          {gridDots.map((dot, index) => (
            <Circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r="1"
              fill={textColor + "20"}
            />
          ))}

          {numbers.map((num) => (
            <React.Fragment key={num.id}>
              <SvgText
                x={num.x}
                y={num.y}
                fontSize="18"
                fontWeight="bold"
                fill={textColor}
                textAnchor="middle"
                pointerEvents="none"
                dy=".3em"
              >
                {num.id}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  canvasContainer: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default CaptchaCanvas; 