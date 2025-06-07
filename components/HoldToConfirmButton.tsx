import React, { forwardRef, useImperativeHandle } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

// --- Component Constants ---
const BUTTON_WIDTH = 150;
const BUTTON_HEIGHT = 45;

// --- TypeScript Definitions ---
export interface HoldButtonHandle {
  reset: () => void;
}

interface HoldToConfirmButtonProps {
  onConfirm: () => void;
  title?: string;
  confirmedTitle?: string;
  duration?: number;
}

// --- The Component ---
const HoldToConfirmButton = forwardRef<HoldButtonHandle, HoldToConfirmButtonProps>(
  ({ 
    onConfirm,
    title = "Hold to Verify",
    confirmedTitle = "Verified",
    duration = 1500 
  }, ref) => {
    
    const progress = useSharedValue(0);
    const isConfirmed = useSharedValue(false);

    // Expose a `reset` function so the parent component can reset the button's state
    useImperativeHandle(ref, () => ({
      reset() {
        isConfirmed.value = false;
        progress.value = withTiming(0);
      },
    }));

    const handlePressIn = () => {
      // Don't allow action if the button is already in a confirmed state
      if (isConfirmed.value) return;

      // Animate progress to 1 over the specified duration
      progress.value = withTiming(1, { duration }, (finished) => {
        // When the animation completes, mark as confirmed and run the callback
        if (finished) {
          isConfirmed.value = true;
          runOnJS(onConfirm)();
        }
      });
    };

    const handlePressOut = () => {
       // If the user releases their finger before completion, cancel the animation
      if (!isConfirmed.value) {
        progress.value = withTiming(0, { duration: 400 }); // Animate back to 0
      }
    };
    
    // Animated style for the green progress bar that fills the button
    const progressBarStyle = useAnimatedStyle(() => {
      return {
        width: `${progress.value * 100}%`,
      };
    });

    // Animated style to create the "slide up" effect for the text
    const textContainerStyle = useAnimatedStyle(() => {
       const translateY = interpolate(
         isConfirmed.value ? 1 : 0,
         [0, 1],
         [0, -BUTTON_HEIGHT] // Slide up by the button's height
       );
      return {
        transform: [{ translateY: withTiming(translateY, {duration: 300}) }],
      };
    });

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        {/* Progress bar view */}
        <Animated.View style={[styles.progressBar, progressBarStyle]} />

        {/* This container holds and slides both text elements */}
        <Animated.View style={[styles.textContainer, textContainerStyle]} pointerEvents="none">
            {/* Initial Text ("Hold to Verify") */}
            <View style={styles.textBlock}>
                <Text style={styles.text}>{title}</Text>
            </View>
            {/* Confirmed Text ("Verified") */}
            <View style={styles.textBlock}>
                 <Text style={[styles.text, styles.confirmedText]}>{confirmedTitle}</Text>
            </View>
        </Animated.View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4CAF50',
  },
  textContainer: {
    // This container is twice the button's height to allow the text to slide up
  },
  textBlock: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmedText: {
     color: 'white',
  }
});

export default HoldToConfirmButton;