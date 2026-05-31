import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function AnotacaoCard({ anotacao, onPress }) {
  const date = new Date(anotacao.updatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <Text style={styles.titulo} numberOfLines={1}>
          {anotacao.titulo}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {anotacao.conteudo}
        </Text>
        <View style={styles.footer}>
          <Feather name="clock" size={11} color="#94a3b8" />
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color="#94a3b8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  accent: {
    width: 4,
    alignSelf: "stretch",
    backgroundColor: "#2563eb",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  titulo: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  preview: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: "#94a3b8",
  },
});
