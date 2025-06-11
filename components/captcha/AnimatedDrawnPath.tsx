import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { G, Path } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type AnimatedDrawnPathProps = {
  path: string;
  color: string;
  progress: SharedValue<number>;
  strokeWidth?: number;
};

const AnimatedDrawnPath = ({
  path,
  color,
  progress,
  strokeWidth = 2.5,
}: AnimatedDrawnPathProps) => {
  const PATH_LENGTH_ADJUSTMENT = 1;
  const pathLength = path
    ? new svgPathProperties(path).getTotalLength() + PATH_LENGTH_ADJUSTMENT
    : 0;

  const animatedProps = useAnimatedProps(() => {
    const animatedProgress = progress.value;

    return {
      strokeDashoffset: interpolate(
        animatedProgress,
        [0, 1],
        [pathLength, 0],
        Extrapolation.CLAMP
      ),
      opacity: 1,
    };
  });

  if (!path || pathLength === 0) return null;

  return (
    <G>
      <Path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.3}
      />
      <AnimatedPath
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        animatedProps={animatedProps}
      />
    </G>
  );
};

export default AnimatedDrawnPath;
