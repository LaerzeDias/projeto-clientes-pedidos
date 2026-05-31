import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "./StatusBadge";

export function PedidoCard({ pedido, onPress }) {
  const date = new Date(pedido.createdAt).toLocaleDateString("pt-BR");
  const valorFormatado = pedido.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.header}>
        <Text style={styles.descricao} numberOfLines={1}>
          {pedido.descricao}
        </Text>
        <Text style={styles.valor}>{valorFormatado}</Text>
      </View>
      <Text style={styles.cliente} numberOfLines={1}>
        {pedido.clienteNome}
      </Text>
      <View style={styles.footer}>
        <StatusBadge status={pedido.status} small />
        <View style={styles.dateRow}>
          <Feather name="calendar" size={12} color="#94a3b8" />
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
    gap: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  descricao: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  valor: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563eb",
  },
  cliente: {
    fontSize: 13,
    color: "#64748b",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
