import { useData } from "@/context/DataContext";
import { StatusBadge } from "@/src/components/StatusBadge";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const STATUS_OPTIONS = [
  { key: "pendente", label: "Pendente", color: "#f59e0b" },
  { key: "em_andamento", label: "Em Andamento", color: "#2563eb" },
  { key: "concluido", label: "Concluído", color: "#16a34a" },
  { key: "cancelado", label: "Cancelado", color: "#ef4444" },
];

export default function PedidoDetailScreen() {
  const { id } = useLocalSearchParams();
  const { pedidos, updatePedido, deletePedido } = useData();
  const navigation = useNavigation();

  const pedido = pedidos.find((p) => p.id === id);

  const [editing, setEditing] = useState(false);
  const [descricao, setDescricao] = useState(pedido?.descricao ?? "");
  const [valor, setValor] = useState(pedido?.valor.toString().replace(".", ",") ?? "");
  const [status, setStatus] = useState(pedido?.status ?? "pendente");
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setEditing((e) => !e)}
          style={{ marginRight: 4, padding: 6 }}
        >
          <Feather
            name={editing ? "x" : "edit-2"}
            size={20}
            color="#2563eb"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, editing]);

  if (!pedido) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Pedido não encontrado</Text>
      </View>
    );
  }

  const valorFormatado = pedido.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const date = new Date(pedido.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleSave = async () => {
    if (!descricao.trim()) {
      Alert.alert("Campo obrigatório", "Informe a descrição do pedido.");
      return;
    }
    const valorNum = parseFloat(valor.replace(",", "."));
    if (isNaN(valorNum)) {
      Alert.alert("Valor inválido", "Informe um valor válido.");
      return;
    }
    setSaving(true);
    try {
      await updatePedido(id, {
        descricao: descricao.trim(),
        valor: valorNum,
        status,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await updatePedido(id, { status: newStatus });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDelete = () => {
    Alert.alert("Excluir Pedido", "Deseja excluir este pedido?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deletePedido(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {editing ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Editar Pedido</Text>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Valor (R$)</Text>
              <TextInput
                style={styles.input}
                value={valor}
                onChangeText={setValor}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.statusGrid}>
                {STATUS_OPTIONS.map(({ key, label }) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.statusOption,
                      status === key && styles.statusOptionActive,
                    ]}
                    onPress={() => setStatus(key)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        status === key && styles.statusOptionTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.btn, saving && styles.btnDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.descricaoText}>{pedido.descricao}</Text>
              <Text style={styles.valorText}>{valorFormatado}</Text>
              <View style={styles.metaRow}>
                <View style={styles.clienteChip}>
                  <Feather name="user" size={12} color="#2563eb" />
                  <Text style={styles.clienteChipText}>{pedido.clienteNome}</Text>
                </View>
                <StatusBadge status={pedido.status} />
              </View>
              <Text style={styles.dateText}>{date}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Alterar Status</Text>
              <View style={styles.statusGrid}>
                {STATUS_OPTIONS.map(({ key, label, color }) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.statusQuickBtn,
                      pedido.status === key && {
                        borderColor: color,
                        backgroundColor: color + "15",
                      },
                    ]}
                    onPress={() => handleStatusChange(key)}
                    activeOpacity={0.7}
                  >
                    {pedido.status === key && (
                      <Feather name="check" size={12} color={color} />
                    )}
                    <Text
                      style={[
                        styles.statusQuickText,
                        pedido.status === key && { color },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Feather name="trash-2" size={16} color="#ef4444" />
              <Text style={styles.deleteBtnText}>Excluir Pedido</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, color: "#64748b" },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  summaryCard: {
    backgroundColor: "#1d4ed8",
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  descricaoText: { fontSize: 18, fontWeight: "700", color: "#ffffff", lineHeight: 24 },
  valorText: { fontSize: 32, fontWeight: "800", color: "#ffffff" },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  clienteChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  clienteChipText: { fontSize: 13, color: "#ffffff", fontWeight: "600" },
  dateText: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 14,
  },
  cardTitle: { fontSize: 13, fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
  },
  inputMulti: { minHeight: 80, paddingTop: 12 },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statusOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: "#e2e8f0", backgroundColor: "#ffffff" },
  statusOptionActive: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  statusOptionText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  statusOptionTextActive: { color: "#2563eb" },
  statusQuickBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: "#e2e8f0" },
  statusQuickText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  btn: { backgroundColor: "#2563eb", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  deleteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: "#fecaca", backgroundColor: "#fff5f5" },
  deleteBtnText: { fontSize: 15, fontWeight: "600", color: "#ef4444" },
});
