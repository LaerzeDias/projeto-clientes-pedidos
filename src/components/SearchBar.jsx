import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar...",
}) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color="#94a3b8" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
});
