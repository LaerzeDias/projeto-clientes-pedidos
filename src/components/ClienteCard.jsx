import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ClienteCard({
  cliente,
  pedidosCount = 0,
  onPress,
}) {
  const initials = cliente.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>
          {cliente.nome}
        </Text>
        {!!cliente.telefone && (
          <Text style={styles.detail} numberOfLines={1}>
            {cliente.telefone}
          </Text>
        )}
        {!!cliente.email && (
          <Text style={styles.detail} numberOfLines={1}>
            {cliente.email}
          </Text>
        )}
      </View>
      <View style={styles.right}>
        {pedidosCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pedidosCount}</Text>
          </View>
        )}
        <Feather name="chevron-right" size={18} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  detail: {
    fontSize: 13,
    color: "#64748b",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
});
