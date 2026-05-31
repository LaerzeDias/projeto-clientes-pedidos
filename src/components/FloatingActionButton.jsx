import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function FloatingActionButton({
  onPress,
  icon = "plus",
}) {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          bottom:
            Platform.OS === "web"
              ? 34 + 84 + 16
              : insets.bottom + 80 + 16,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <Feather name={icon} size={26} color="#ffffff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
});
