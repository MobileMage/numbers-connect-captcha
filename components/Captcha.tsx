import shapes from "@/constants/Shapes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Headphones, Info, RotateCcw } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";
import { HoldButtonHandle } from "./HoldToConfirmButton";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get("window");
const MAX_CANVAS_SIZE = 400; // Maximum size for the canvas
const CANVAS_WIDTH = Math.min(width * 0.9, MAX_CANVAS_SIZE);
const CANVAS_HEIGHT = CANVAS_WIDTH; // Make height equal to width for 1:1 aspect ratio
const NUMBER_RADIUS = 20;

type Number = {
  id: number;
  x: number;
  y: number;
};

const generateNumbers = () => {
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

const AnimatedDrawnPath = ({ 
  path, 
  color, 
  progress,
  strokeWidth = 2.5 
}: { 
  path: string; 
  color: string; 
  progress: Animated.SharedValue<number>;
  strokeWidth?: number;
}) => {
  const PATH_LENGTH_ADJUSTMENT = 1;
  const pathLength = path ? new svgPathProperties(path).getTotalLength() + PATH_LENGTH_ADJUSTMENT : 0;

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
      {/* Background path with lower opacity */}
      <Path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.3}
      />
      {/* Animated path */}
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

const Captcha = () => {
  const textColor = useThemeColor({}, "text");
  const [numbers, setNumbers] = useState<Number[]>(generateNumbers());
  const [path, setPath] = useState("");
  const [livePath, setLivePath] = useState("");
  const [connectedOrder, setConnectedOrder] = useState<number[]>([]);
  const [pathColor, setPathColor] = useState(textColor);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const holdButtonRef = useRef<HoldButtonHandle>(null);

  // Animation progress shared value
  const animationProgress = useSharedValue(1);

  const handleReset = () => {
    setNumbers(generateNumbers());
    setPath("");
    setLivePath("");
    setConnectedOrder([]);
    setPathColor(textColor);
    setIsDrawing(false);
    setIsVerifying(false);
    holdButtonRef.current?.reset();
    animationProgress.value = 1; // Reset animation
  };

  const checkCollision = (x: number, y: number): Number | null => {
    for (const num of numbers) {
      const distance = Math.hypot(num.x - x, num.y - y);
      if (distance < NUMBER_RADIUS) {
        return num;
      }
    }
    return null;
  };

  const handleTouchStart = (x: number, y: number) => {
    console.log("handleTouchStart");
    if (isVerifying) return; // Prevent drawing during verification
    
    const hitNumber = checkCollision(x, y);

    // if (connectedOrder.length === 0 && (!hitNumber || hitNumber.id !== 1)) {
    //   setIsDrawing(false);
    //   return;
    // }

    setIsDrawing(true);

    if (hitNumber && !connectedOrder.includes(hitNumber.id)) {
      if (connectedOrder.length === 0 && hitNumber.id === 1) {
        setConnectedOrder([1]);
      }
    }
    setLivePath(`M${x},${y}`);
  };

  const handleTouchMove = (x: number, y: number) => {
    if (!isDrawing || isVerifying) return;

    setLivePath((prev) => prev + ` L${x},${y}`);

    const hitNumber = checkCollision(x, y);
    if (hitNumber && !connectedOrder.includes(hitNumber.id)) {
      const lastNumberId = connectedOrder[connectedOrder.length - 1];
      if (hitNumber.id === lastNumberId + 1) {
        setConnectedOrder((prev) => [...prev, hitNumber.id]);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isVerifying) return;
    
    setIsDrawing(false);
    setPath((prev) => prev + livePath);
    setLivePath("");
  };

  const handleVerify = () => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    const expectedOrder = Array.from(
      { length: numbers.length },
      (_, i) => i + 1
    );
    const isCorrect =
      JSON.stringify(connectedOrder) === JSON.stringify(expectedOrder);

    const newColor = isCorrect ? "#4CAF50" : "#F44336";
    setPathColor(newColor);

    // Start the path animation
    const fullPath = path + livePath;
    if (fullPath) {
      const pathLength = new svgPathProperties(fullPath).getTotalLength();
      console.log("pathLength", pathLength);
      const duration = Math.max(pathLength/2);
      
      animationProgress.value = 0;
      animationProgress.value = withTiming(1, {
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }

    // Handle post-verification logic
    setTimeout(() => {
      setIsVerifying(false);
      if (!isCorrect) {
        holdButtonRef.current?.reset();
        // Optionally reset path color after animation
        setTimeout(() => {
          setPathColor(textColor);
        }, 50);
      }
    }, 500);
  };

  // Create the pan gesture using Gesture Handler v2
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      runOnJS(handleTouchStart)(event.x, event.y);
    })
    .onUpdate((event) => {
      runOnJS(handleTouchMove)(event.x, event.y);
    })
    .onEnd(() => {
      runOnJS(handleTouchEnd)();
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

  const backgroundColor = useThemeColor({}, "background");
  const borderColor = textColor + "25";

  return (
    <View style={styles.container}>
      <View style={[styles.canvasContainer, { borderColor }]}>
        <GestureDetector gesture={panGesture}>
          <Svg
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
          >
            {gridDots.map((dot, index) => (
              <Circle
                key={index}
                cx={dot.x}
                cy={dot.y}
                r="1"
                fill={textColor + "20"}
              />
            ))}
            
            {/* Show animated path during verification, regular path otherwise */}
            {isVerifying && (path + livePath) ? (
              <AnimatedDrawnPath
                path={path + livePath}
                color={pathColor}
                progress={animationProgress}
                strokeWidth={2.5}
              />
            ) : (
              <>
                <Path d={path} stroke={pathColor} strokeWidth="2.5" fill="none" />
                <Path d={livePath} stroke={pathColor} strokeWidth="2.5" fill="none" />
              </>
            )}

            {numbers.map((num) => (
              <React.Fragment key={num.id}>
                <Circle
                  cx={num.x}
                  cy={num.y}
                  r={NUMBER_RADIUS}
                  fill="transparent"
                />
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
      </View>
      <View style={styles.actionBar}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={handleReset} style={styles.iconButton}>
            <RotateCcw color={textColor} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Headphones color={textColor} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Info color={textColor} size={24} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleVerify}
          style={[
            styles.verifyButton, 
            { 
              backgroundColor: isVerifying ? pathColor : textColor,
              opacity: isVerifying ? 0.8 : 1
            }
          ]}
          disabled={isVerifying}
        >
          <Text style={[styles.buttonText, { color: backgroundColor }]}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 20,
  },
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
  actionBar: {
    width: CANVAS_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  leftIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  verifyButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Captcha;