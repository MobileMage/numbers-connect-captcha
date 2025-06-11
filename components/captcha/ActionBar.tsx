import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Headphones, Info, RotateCcw } from "lucide-react-native";
import { CANVAS_WIDTH } from "./types";

type ActionBarProps = {
  textColor: string;
  backgroundColor: string;
  onReset: () => void;
  onVerify: () => void;
  isVerifying: boolean;
  pathColor: string;
  onAudioPress: () => void;
  onInfoPress: () => void;
  showButton: boolean;
};

const ActionBar = ({
  textColor,
  backgroundColor,
  onReset,
  onVerify,
  isVerifying,
  pathColor,
  onAudioPress,
  onInfoPress,
  showButton,
}: ActionBarProps) => {
  return (
    <View style={styles.actionBar}>
      <View style={styles.leftIcons}>
        <TouchableOpacity onPress={onReset} style={styles.iconButton}>
          <RotateCcw color={textColor} size={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onAudioPress}
        >
          <Headphones color={textColor} size={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onInfoPress}
        >
          <Info color={textColor} size={24} />
        </TouchableOpacity>
      </View>
      {
        showButton && (
        <TouchableOpacity
        onPress={onVerify}
        style={[
          styles.verifyButton,
          {
            backgroundColor: isVerifying ? pathColor : textColor,
            opacity: isVerifying ? 0.8 : 1,
          },
        ]}
        disabled={isVerifying}
      >
        <Text style={[styles.buttonText, { color: backgroundColor }]}>
          {isVerifying ? "Verifying..." : "Verify"}
        </Text>
      </TouchableOpacity>)}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ActionBar; 