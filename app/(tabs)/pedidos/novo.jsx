import { useData } from "@/context/DataContext";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
  { key: "pendente", label: "Pendente" },
  { key: "em_andamento", label: "Em Andamento" },
  { key: "concluido", label: "Concluído" },
  { key: "cancelado", label: "Cancelado" },
];

export default function NovoPedidoScreen() {
  const { clientes, addPedido } = useData();
  const params = useLocalSearchParams();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("pendente");
  const [clienteId, setClienteId] = useState(params.clienteId ?? "");
  const [saving, setSaving] = useState(false);

  const clienteSelecionado = clientes.find((c) => c.id === clienteId);

  const handleSave = async () => {
    if (!descricao.trim()) {
      Alert.alert("Campo obrigatório", "Informe a descrição do pedido.");
      return;
    }
    if (!clienteId) {
      Alert.alert("Cliente obrigatório", "Selecione um cliente para o pedido.");
      return;
    }
    const valorNum = parseFloat(valor.replace(",", "."));
    if (isNaN(valorNum) || valorNum < 0) {
      Alert.alert("Valor inválido", "Informe um valor válido para o pedido.");
      return;
    }

    setSaving(true);
    try {
      await addPedido({
        descricao: descricao.trim(),
        valor: valorNum,
        status,
        clienteId,
        clienteNome: clienteSelecionado?.nome ?? "",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"height"}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>
            Cliente <Text style={styles.required}>*</Text>
          </Text>
          {clienteSelecionado ? (
            <View style={styles.selectedClient}>
              <Text style={styles.selectedClientName}>
                {clienteSelecionado.nome}
              </Text>
              {!params.clienteId && (
                <TouchableOpacity onPress={() => setClienteId("")}>
                  <Text style={styles.changeBtn}>Trocar</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <ScrollView
              style={styles.clienteList}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {clientes.length === 0 ? (
                <Text style={styles.noClientes}>
                  Nenhum cliente cadastrado. Adicione um cliente primeiro.
                </Text>
              ) : (
                clientes.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.clienteOption,
                      clienteId === c.id && styles.clienteOptionActive,
                    ]}
                    onPress={() => setClienteId(c.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.clienteOptionText,
                        clienteId === c.id && styles.clienteOptionTextActive,
                      ]}
                    >
                      {c.nome}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>
            Descrição <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o pedido..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            placeholder="0,00"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Status</Text>
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
            {saving ? "Salvando..." : "Salvar Pedido"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  fieldWrap: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  required: { color: "#ef4444" },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  inputMulti: { minHeight: 80, paddingTop: 12 },
  selectedClient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  selectedClientName: { fontSize: 15, fontWeight: "600", color: "#1d4ed8" },
  changeBtn: { fontSize: 13, color: "#2563eb", fontWeight: "600" },
  clienteList: {
    maxHeight: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  noClientes: { padding: 16, fontSize: 14, color: "#94a3b8", textAlign: "center" },
  clienteOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  clienteOptionActive: { backgroundColor: "#eff6ff" },
  clienteOptionText: { fontSize: 15, color: "#0f172a" },
  clienteOptionTextActive: { color: "#2563eb", fontWeight: "600" },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statusOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  statusOptionActive: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  statusOptionText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  statusOptionTextActive: { color: "#2563eb" },
  btn: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});
