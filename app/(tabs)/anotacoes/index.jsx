import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useData } from "@/context/DataContext";
import { AnotacaoCard } from "@/src/components/AnotacaoCard";
import { EmptyState } from "@/src/components/EmptyState";
import { FloatingActionButton } from "@/src/components/FloatingActionButton";
import { SearchBar } from "@/src/components/SearchBar";

export default function AnotacoesScreen() {
  const { anotacoes, loading } = useData();
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = q
      ? anotacoes.filter(
          (a) =>
            a.titulo.toLowerCase().includes(q) ||
            a.conteudo.toLowerCase().includes(q)
        )
      : anotacoes;
    return [...list].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [anotacoes, search]);

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
            <Text style={styles.count}>
              {filtered.length}{" "}
              {filtered.length === 1 ? "anotação" : "anotações"}
            </Text>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar anotações..."
            />
          </View>
        }
        renderItem={({ item }) => (
          <AnotacaoCard
            anotacao={item}
            onPress={() => router.push(`/(tabs)/anotacoes/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="file-text"
            title={search ? "Nenhum resultado" : "Nenhuma anotação ainda"}
            subtitle={
              search
                ? "Tente buscar por outro termo"
                : "Toque no botão + para criar sua primeira anotação"
            }
          />
        }
      />
      <FloatingActionButton
        onPress={() => router.push("/(tabs)/anotacoes/nova")}
        icon="edit-3"
      />
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
