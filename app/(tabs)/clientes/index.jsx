import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useData } from "@/context/DataContext";
import { ClienteCard } from "@/src/components/ClienteCard";
import { EmptyState } from "@/src/components/EmptyState";
import { FloatingActionButton } from "@/src/components/FloatingActionButton";
import { SearchBar } from "@/src/components/SearchBar";

export default function ClientesScreen() {
  const { clientes, pedidos, loading } = useData();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.telefone.includes(q)
    );
  }, [clientes, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.nome.localeCompare(b.nome)),
    [filtered]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#2563eb" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: insets.bottom + 80 + 80,
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.count}>
              {filtered.length}{" "}
              {filtered.length === 1 ? "cliente" : "clientes"}
            </Text>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome, e-mail ou telefone..."
            />
          </View>
        }
        renderItem={({ item }) => (
          <ClienteCard
            cliente={item}
            pedidosCount={pedidos.filter((p) => p.clienteId === item.id).length}
            onPress={() => router.push(`/(tabs)/clientes/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          search ? (
            <EmptyState
              icon="search"
              title="Nenhum resultado"
              subtitle="Tente buscar por outro termo"
            />
          ) : (
            <EmptyState
              icon="users"
              title="Nenhum cliente ainda"
              subtitle="Toque no botão + para adicionar seu primeiro cliente"
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563eb"
          />
        }
        scrollEnabled={sorted.length > 0}
        showsVerticalScrollIndicator={false}
      />
      <FloatingActionButton onPress={() => router.push("/(tabs)/clientes/nova")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { flexGrow: 1, paddingTop: 8 },
  header: { paddingTop: 12, paddingBottom: 4 },
  count: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
});
