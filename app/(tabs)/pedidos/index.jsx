import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useData } from "@/context/DataContext";
import { EmptyState } from "@/src/components/EmptyState";
import { FloatingActionButton } from "@/src/components/FloatingActionButton";
import { PedidoCard } from "@/src/components/PedidoCard";
import { SearchBar } from "@/src/components/SearchBar";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "pendente", label: "Pendente" },
  { key: "em_andamento", label: "Em Andamento" },
  { key: "concluido", label: "Concluído" },
  { key: "cancelado", label: "Cancelado" },
];

export default function PedidosScreen() {
  const { pedidos, loading } = useData();
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    let result = pedidos;
    if (filter !== "todos") result = result.filter((p) => p.status === filter);
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.descricao.toLowerCase().includes(q) ||
          p.clienteNome.toLowerCase().includes(q)
      );
    }
    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [pedidos, filter, search]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#2563eb" size="large" />
      </View>
    );
  }

  const totalValor = filtered.reduce((acc, p) => acc + p.valor, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: insets.bottom + 80 + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ListHeaderComponent={
          <View style={styles.header}>
            {filtered.length > 0 && (
              <View style={styles.totalBanner}>
                <Text style={styles.totalLabel}>Total filtrado</Text>
                <Text style={styles.totalValue}>
                  {totalValor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
            )}
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar pedidos ou clientes..."
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {FILTERS.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.filterChip,
                    filter === key && styles.filterChipActive,
                  ]}
                  onPress={() => setFilter(key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === key && styles.filterTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <PedidoCard
            pedido={item}
            onPress={() => router.push(`/(tabs)/pedidos/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="shopping-bag"
            title={search || filter !== "todos" ? "Nenhum resultado" : "Nenhum pedido ainda"}
            subtitle={
              search || filter !== "todos"
                ? "Tente alterar os filtros de busca"
                : "Toque no botão + para criar seu primeiro pedido"
            }
          />
        }
      />
      <FloatingActionButton onPress={() => router.push("/(tabs)/pedidos/novo")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { flexGrow: 1, paddingTop: 8 },
  header: { paddingTop: 4, paddingBottom: 8, gap: 0 },
  totalBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  totalLabel: { fontSize: 13, color: "#2563eb", fontWeight: "500" },
  totalValue: { fontSize: 16, fontWeight: "800", color: "#1d4ed8" },
  filters: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  filterChipActive: { backgroundColor: "#2563eb" },
  filterText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  filterTextActive: { color: "#ffffff" },
});
