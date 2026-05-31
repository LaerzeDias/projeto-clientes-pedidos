import { StyleSheet, Text, View } from "react-native";

const statusConfig = {
  pendente: { label: "Pendente", bg: "#fef3c7", text: "#d97706" },
  em_andamento: { label: "Em Andamento", bg: "#dbeafe", text: "#2563eb" },
  concluido: { label: "Concluído", bg: "#dcfce7", text: "#16a34a" },
  cancelado: { label: "Cancelado", bg: "#fee2e2", text: "#dc2626" },
};

export function StatusBadge({ status, small }) {
  const config = statusConfig[status];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        small && styles.badgeSmall,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config.text },
          small && styles.textSmall,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 11,
  },
});
