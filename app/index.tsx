import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Captcha from "@/components/Captcha";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <Captcha />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
