import { useAudioPlayer } from "expo-audio";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import Animated, { FadeInDown, SlideOutDown, FadeOutUp } from "react-native-reanimated";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./types";

const audioSource = require("@/assets/audio/nevergonnagiveyouup.mp3");

const AudioPlayer = () => {
  const textColor = useThemeColor({}, "text");
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    player.play();

    return () => {
      player.pause();
      player.seekTo(0);
    };
  }, [player]);

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={[styles.container, { borderColor: textColor + "20" }]}
    >
      <View style={styles.content}>
        <Text style={[styles.songTitle, { color: textColor }]}>
          Never Gonna Give You Up
        </Text>
        <Text style={[styles.artist, { color: textColor + "80" }]}>
          Rick Astley
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  artist: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
  },
});

export default AudioPlayer;
