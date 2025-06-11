import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";
import { CANVAS_WIDTH } from "./types";

type FeedbackDisplayProps = {
  showMissed: boolean;
  missedNumbers: number[];
  showSuccess: boolean;
};

const FeedbackDisplay = ({
  showMissed,
  missedNumbers,
  showSuccess,
}: FeedbackDisplayProps) => {
  const getFeedbackMessage = () => {
    if (missedNumbers.length === 0) {
      return "";
    }

    if (missedNumbers.length === 1) {
      return `You missed number ${missedNumbers[0]}`;
    } else if (missedNumbers.length <= 3) {
      return `You missed numbers ${missedNumbers.join(", ")}`;
    } else {
      return `You missed ${missedNumbers.length} numbers`;
    }
  };

  return (
    <View style={styles.feedbackWrapper}>
      {showMissed && missedNumbers.length > 0 && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={[
            styles.feedbackContainer,
            { backgroundColor: "#F44336" + "20", borderColor: "#F44336" },
          ]}
        >
          <Text style={[styles.feedbackText, { color: "#F44336" }]}>
            {getFeedbackMessage()}
          </Text>
        </Animated.View>
      )}

      {showSuccess && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          layout={LinearTransition}
          style={[
            styles.feedbackContainer,
            { backgroundColor: "#4CAF50" + "20", borderColor: "#4CAF50" },
          ]}
        >
          <Text style={[styles.feedbackText, { color: "#4CAF50" }]}>
            Captcha Solved!
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackWrapper: {
    width: CANVAS_WIDTH,
    minHeight: 40,
    position: "relative",
  },
  feedbackContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default FeedbackDisplay; 