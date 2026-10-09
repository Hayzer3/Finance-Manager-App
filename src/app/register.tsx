import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { ActionButton } from "../components/ActionButton";
import { validateRegistration } from "../utils/validation";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    const validationError = validateRegistration(name, email, password);
    if (validationError) return setError(validationError);
    Alert.alert(
      "Cadastro demonstrativo",
      "A autenticação ainda não está conectada ao Firebase.",
      [{ text: "Entendi", onPress: () => router.back() }],
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </Pressable>
        <View style={styles.card}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.copy}>Cadastro para demonstração do app.</Text>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            style={styles.input}
          />
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="voce@email.com"
            style={styles.input}
          />
          <Text style={styles.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Mínimo de 6 caracteres"
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <ActionButton title="Cadastrar" onPress={submit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { flexGrow: 1, justifyContent: "center", padding: 24 },
  back: { color: "#23594C", fontSize: 16, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    borderColor: "#E9ECEB",
    borderWidth: 1,
  },
  title: { color: "#202A27", fontSize: 24, fontWeight: "700" },
  copy: { color: "#7B8581", marginTop: 7, marginBottom: 20 },
  label: {
    color: "#46514D",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#F8F9F9",
    borderColor: "#E7EBE9",
    borderWidth: 1,
    borderRadius: 13,
    minHeight: 52,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#202A27",
  },
  error: { color: "#B42318", marginVertical: 12 },
});
