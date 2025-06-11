import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { svgPathProperties } from "svg-path-properties";
import CaptchaCanvas from "./CaptchaCanvas";
import FeedbackDisplay from "./FeedbackDisplay";
import { checkCollision, generateNumbers, removeDuplicates } from "./utils";
import ActionBar from "./ActionBar";
import AudioPlayer from "./AudioPlayer";
import InfoModal from "./InfoModal";

type HoldButtonHandle = {
  reset: () => void;
};

const Captcha = () => {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = textColor + "25";

  const [numbers, setNumbers] = useState(generateNumbers());
  const [path, setPath] = useState("");
  const [livePath, setLivePath] = useState("");
  const [connectedOrder, setConnectedOrder] = useState<number[]>([]);
  const [pathColor, setPathColor] = useState(textColor);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [missedNumbers, setMissedNumbers] = useState<number[]>([]);
  const [showMissed, setShowMissed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const holdButtonRef = useRef<HoldButtonHandle>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const animationProgress = useSharedValue(1);

  const handleReset = () => {
    setNumbers(generateNumbers());
    setPath("");
    setLivePath("");
    setConnectedOrder([]);
    setPathColor(textColor);
    setIsDrawing(false);
    setIsVerifying(false);
    setMissedNumbers([]);
    setShowMissed(false);
    setShowSuccessModal(false);
    holdButtonRef.current?.reset();
    animationProgress.value = 1;
  };

  const handleTouchStart = (x: number, y: number) => {
    if (isVerifying) return;

    const hitNumber = checkCollision(x, y, numbers);

    setIsDrawing(true);
    setPath("");
    setConnectedOrder([]);

    if (hitNumber && !connectedOrder.includes(hitNumber.id)) {
      if (hitNumber.id === 1) {
        setConnectedOrder([1]);
      }
    }

    setLivePath(`M${x},${y}`);
  };

  const handleTouchMove = (x: number, y: number) => {
    if (!isDrawing || isVerifying) return;

    setLivePath((prev) => prev + ` L${x},${y}`);

    const hitNumber = checkCollision(x, y, numbers);
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

    const cleanedConnectedOrder = removeDuplicates(connectedOrder);
    const cleanedExpectedOrder = removeDuplicates(expectedOrder);

    const isCorrect =
      JSON.stringify(cleanedConnectedOrder) ===
      JSON.stringify(cleanedExpectedOrder);

    const newColor = isCorrect ? "#4CAF50" : "#F44336";
    setPathColor(newColor);

    if (!isCorrect) {
      const missed = expectedOrder.filter(
        (num) => !connectedOrder.includes(num)
      );
      setMissedNumbers(missed);
      setShowMissed(true);
      setShowSuccessModal(false); // Ensure success modal is hidden on error
    } else {
      setMissedNumbers([]);
      setShowMissed(false);
      setShowSuccessModal(true); // Show success modal
    }

    const fullPath = path + livePath;
    if (fullPath) {
      const pathLength = new svgPathProperties(fullPath).getTotalLength();
      const duration = Math.max(pathLength / 2);

      animationProgress.value = 0;
      animationProgress.value = withTiming(1, {
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }

    setTimeout(() => {
      setIsVerifying(false);
      if (!isCorrect) {
        holdButtonRef.current?.reset();
        setTimeout(() => {
          setShowMissed(false);
          setPathColor(textColor);
        }, 2000);
      } else {
        // Cleanup after successful verification
        setTimeout(() => {
          handleReset(); // Reset the captcha after success modal
        }, 1500); // Give some time to see the success modal
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <FeedbackDisplay
        showMissed={showMissed}
        missedNumbers={missedNumbers}
        showSuccess={showSuccessModal}
      />
      {showAudioPlayer && <AudioPlayer />}
      {showInfoModal && <InfoModal />}
      {!showAudioPlayer && !showInfoModal && (
        <CaptchaCanvas
          numbers={numbers}
          path={path}
          livePath={livePath}
          pathColor={pathColor}
          isVerifying={isVerifying}
          textColor={textColor}
          borderColor={borderColor}
          animationProgress={animationProgress}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      )}

      <ActionBar
        showButton={!showAudioPlayer && !showInfoModal}
        textColor={textColor}
        backgroundColor={backgroundColor}
        onReset={() => {
          setShowAudioPlayer(false);
          setShowInfoModal(false);
          handleReset();
        }}
        onVerify={handleVerify}
        isVerifying={isVerifying}
        pathColor={pathColor}
        onAudioPress={() => {
          setShowAudioPlayer(true);
          setShowInfoModal(false);
        }}
        onInfoPress={() => {
          setShowInfoModal(true);
          setShowAudioPlayer(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 20,
  },
});

export default Captcha;
