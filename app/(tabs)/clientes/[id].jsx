import { useData } from "@/context/DataContext";
import { PedidoCard } from "@/src/components/PedidoCard";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
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

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams();
  const { clientes, pedidos, updateCliente, deleteCliente } = useData();
  const navigation = useNavigation();

  const cliente = clientes.find((c) => c.id === id);
  const clientePedidos = pedidos
    .filter((p) => p.clienteId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [telefone, setTelefone] = useState(cliente?.telefone ?? "");
  const [email, setEmail] = useState(cliente?.email ?? "");
  const [endereco, setEndereco] = useState(cliente?.endereco ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setTelefone(cliente.telefone);
      setEmail(cliente.email);
      setEndereco(cliente.endereco);
    }
  }, [cliente]);

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

  if (!cliente) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Cliente não encontrado</Text>
      </View>
    );
  }

  const initials = cliente.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Campo obrigatório", "Informe o nome do cliente.");
      return;
    }
    setSaving(true);
    try {
      await updateCliente(id, {
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim().toLowerCase(),
        endereco: endereco.trim(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Cliente",
      `Deseja excluir "${cliente.nome}"? Todos os pedidos deste cliente também serão removidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteCliente(id);
            router.back();
          },
        },
      ]
    );
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
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {!editing && (
            <Text style={styles.avatarName}>{cliente.nome}</Text>
          )}
        </View>

        {editing ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Editar Informações</Text>

            {[
              { label: "Nome", value: nome, onChange: setNome, keyboard: "default", placeholder: "Nome completo" },
              { label: "Telefone", value: telefone, onChange: setTelefone, keyboard: "phone-pad", placeholder: "(11) 99999-9999" },
              { label: "E-mail", value: email, onChange: setEmail, keyboard: "email-address", placeholder: "email@exemplo.com" },
              { label: "Endereço", value: endereco, onChange: setEndereco, keyboard: "default", placeholder: "Rua, número, cidade..." },
            ].map(({ label, value, onChange, keyboard, placeholder }) => (
              <View key={label} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  keyboardType={keyboard}
                  placeholder={placeholder}
                  placeholderTextColor="#94a3b8"
                  autoCapitalize={keyboard === "email-address" ? "none" : "words"}
                />
              </View>
            ))}

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
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações</Text>
            {[
              { icon: "phone", label: "Telefone", value: cliente.telefone },
              { icon: "mail", label: "E-mail", value: cliente.email },
              { icon: "map-pin", label: "Endereço", value: cliente.endereco },
            ].map(({ icon, label, value }) =>
              value ? (
                <View key={label} style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Feather name={icon} size={16} color="#2563eb" />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={styles.infoValue}>{value}</Text>
                  </View>
                </View>
              ) : null
            )}
            {!cliente.telefone && !cliente.email && !cliente.endereco && (
              <Text style={styles.noInfo}>Nenhuma informação adicional</Text>
            )}
          </View>
        )}

        {!editing && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Pedidos ({clientePedidos.length})
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/pedidos/novo",
                    params: { clienteId: id, clienteNome: cliente.nome },
                  })
                }
                style={styles.addBtn}
              >
                <Feather name="plus" size={14} color="#2563eb" />
                <Text style={styles.addBtnText}>Novo Pedido</Text>
              </TouchableOpacity>
            </View>
            {clientePedidos.length === 0 ? (
              <View style={styles.emptyPedidos}>
                <Feather name="shopping-bag" size={28} color="#cbd5e1" />
                <Text style={styles.emptyPedidosText}>
                  Nenhum pedido ainda
                </Text>
              </View>
            ) : (
              clientePedidos.map((p) => (
                <PedidoCard
                  key={p.id}
                  pedido={p}
                  onPress={() =>
                    router.push(`/(tabs)/pedidos/${p.id}`)
                  }
                />
              ))
            )}
          </View>
        )}

        {!editing && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Feather name="trash-2" size={16} color="#ef4444" />
            <Text style={styles.deleteBtnText}>Excluir Cliente</Text>
          </TouchableOpacity>
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
  avatarSection: { alignItems: "center", paddingVertical: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#2563eb" },
  avatarName: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
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
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "500" },
  infoValue: { fontSize: 14, color: "#0f172a", fontWeight: "500", marginTop: 1 },
  noInfo: { fontSize: 14, color: "#94a3b8", textAlign: "center", paddingVertical: 8 },
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
  btn: { backgroundColor: "#2563eb", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  section: { gap: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  addBtnText: { fontSize: 14, fontWeight: "600", color: "#2563eb" },
  emptyPedidos: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    gap: 8,
  },
  emptyPedidosText: { fontSize: 14, color: "#94a3b8" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#fecaca",
    backgroundColor: "#fff5f5",
  },
  deleteBtnText: { fontSize: 15, fontWeight: "600", color: "#ef4444" },
});
