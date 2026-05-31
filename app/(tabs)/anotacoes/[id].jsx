import { useData } from "@/context/DataContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

export default function AnotacaoDetailScreen() {
  const { id } = useLocalSearchParams();
  const { anotacoes, updateAnotacao, deleteAnotacao } = useData();
  const navigation = useNavigation();

  const anotacao = anotacoes.find((a) => a.id === id);

  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(anotacao?.titulo ?? "");
  const [conteudo, setConteudo] = useState(anotacao?.conteudo ?? "");
  const [saving, setSaving] = useState(false);
  const conteudoRef = useRef(null);

  useEffect(() => {
    if (anotacao) {
      setTitulo(anotacao.titulo);
      setConteudo(anotacao.conteudo);
    }
  }, [anotacao]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {editing ? (
            <TouchableOpacity
              onPress={() => setEditing(false)}
              style={{ padding: 6 }}
            >
              <Feather name="x" size={20} color="#2563eb" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setEditing(true)}
                style={{ padding: 6 }}
              >
                <Feather name="edit-2" size={20} color="#2563eb" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={{ padding: 6 }}
              >
                <Feather name="trash-2" size={20} color="#ef4444" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ),
    });
  }, [navigation, editing]);

  if (!anotacao) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Anotação não encontrada</Text>
      </View>
    );
  }

  const updatedDate = new Date(anotacao.updatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert("Campo obrigatório", "Informe o título da anotação.");
      return;
    }
    setSaving(true);
    try {
      await updateAnotacao(id, {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Excluir Anotação", "Deseja excluir esta anotação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteAnotacao(id);
          router.back();
        },
      },
    ]);
  };

  if (editing) {
    return (
      <KeyboardAvoidingView
        style={styles.editContainer}
        behavior={"height"}
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
        />
        <TextInput
          ref={conteudoRef}
          style={styles.bodyInput}
          value={conteudo}
          onChangeText={setConteudo}
          placeholder="Escreva aqui..."
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.metaDate}>Atualizado em {updatedDate}</Text>
      <Text style={styles.tituloText}>{anotacao.titulo}</Text>
      <View style={styles.divider} />
      <Text style={styles.conteudoText}>
        {anotacao.conteudo || "Sem conteúdo"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, color: "#64748b" },
  content: { padding: 24, paddingBottom: 60 },
  metaDate: { fontSize: 12, color: "#94a3b8", marginBottom: 12 },
  tituloText: { fontSize: 26, fontWeight: "800", color: "#0f172a", lineHeight: 34 },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 16 },
  conteudoText: { fontSize: 16, color: "#334155", lineHeight: 26 },
  editContainer: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
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
