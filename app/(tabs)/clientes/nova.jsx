import { useData } from "@/context/DataContext";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useRef, useState } from "react";
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

function Field({
  label,
  required,
  children,
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

export default function NovaClienteScreen() {
  const { addCliente } = useData();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [saving, setSaving] = useState(false);

  const telRef = useRef(null);
  const emailRef = useRef(null);
  const endRef = useRef(null);

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Campo obrigatório", "Informe o nome do cliente.");
      return;
    }
    setSaving(true);
    try {
      await addCliente({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim().toLowerCase(),
        endereco: endereco.trim(),
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
        <Field label="Nome" required>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome completo"
            placeholderTextColor="#94a3b8"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => telRef.current?.focus()}
          />
        </Field>

        <Field label="Telefone">
          <TextInput
            ref={telRef}
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(11) 99999-9999"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        </Field>

        <Field label="E-mail">
          <TextInput
            ref={emailRef}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => endRef.current?.focus()}
          />
        </Field>

        <Field label="Endereço">
          <TextInput
            ref={endRef}
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Rua, número, cidade..."
            placeholderTextColor="#94a3b8"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </Field>

        <TouchableOpacity
          style={[styles.btn, saving && styles.btnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            {saving ? "Salvando..." : "Salvar Cliente"}
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
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "600", color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
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
