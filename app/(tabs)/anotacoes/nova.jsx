import { useData } from "@/context/DataContext";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

export default function NovaAnotacaoScreen() {
  const { addAnotacao } = useData();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [saving, setSaving] = useState(false);
  const conteudoRef = useRef(null);

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert("Campo obrigatório", "Informe o título da anotação.");
      return;
    }
    setSaving(true);
    try {
      await addAnotacao({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
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
      behavior="height"
    >
      <TextInput
        style={styles.titleInput}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título"
        placeholderTextColor="#cbd5e1"
        autoFocus
        returnKeyType="next"
        onSubmitEditing={() => conteudoRef.current?.focus()}
        maxLength={100}
      />
      <TextInput
        ref={conteudoRef}
        style={styles.bodyInput}
        value={conteudo}
        onChangeText={setConteudo}
        placeholder="Escreva sua anotação aqui..."
        placeholderTextColor="#cbd5e1"
        multiline
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        <Text style={styles.saveBtnText}>
          {saving ? "Salvando..." : "Salvar"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
  titleInput: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    paddingVertical: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  bodyInput: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    paddingTop: 4,
    maxHeight: 360
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});
