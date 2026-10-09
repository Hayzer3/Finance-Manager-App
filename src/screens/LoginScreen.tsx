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
import { validateCredentials } from "../utils/validation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const enter = () => {
    const validationError = validateCredentials(email, password);
    if (validationError) return setError(validationError);
    setError("");
    Alert.alert(
      "Modo demonstração",
      "O acesso não usa autenticação real. Você entrará no app de demonstração.",
      [{ text: "Continuar", onPress: () => router.replace("/dashboard") }],
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
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.appName}>Finance Manager</Text>
          <Text style={styles.subtitle}>Seu dinheiro, mais organizado.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.copy}>Entre para acompanhar suas finanças.</Text>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            accessibilityLabel="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="voce@email.com"
            style={styles.input}
          />
          <Text style={styles.label}>Senha</Text>
          <View style={styles.password}>
            <TextInput
              accessibilityLabel="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              placeholder="Sua senha"
              style={styles.passwordInput}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              accessibilityRole="button"
            >
              <Text style={styles.show}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </Pressable>
          </View>
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          <ActionButton title="Entrar" onPress={enter} />
          <Pressable
            style={styles.signup}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.signupText}>
              Não tem conta? <Text style={styles.signupLink}>Cadastre-se</Text>
            </Text>
          </Pressable>
        </View>
        <Text style={styles.demo}>
          DEMONSTRAÇÃO ACADÊMICA · dados salvos somente neste aparelho
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  page: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingVertical: 36,
  },
  brand: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#23594C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logoText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "800",
  },
  appName: {
    color: "#202A27",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#7B8581",
    marginTop: 5,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E9ECEB",
  },
  title: {
    color: "#202A27",
    fontSize: 22,
    fontWeight: "700",
  },
  copy: {
    color: "#7B8581",
    fontSize: 14,

    marginTop: 6,
    marginBottom: 22,
  },
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
  password: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9F9",
    borderColor: "#E7EBE9",
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  passwordInput: {
    flex: 1,
    color: "#202A27",
    fontSize: 15,
  },
  show: {
    color: "#23594C",
    fontWeight: "700",
    padding: 8,
  },
  error: {
    color: "#B42318",
    fontSize: 13,
    marginVertical: 12,
  },
  signup: {
    alignItems: "center",
    marginTop: 20,
    minHeight: 42,
    justifyContent: "center",
  },
  signupText: { color: "#6F7975" },
  signupLink: { color: "#23594C", fontWeight: "700" },
  demo: {
    textAlign: "center",
    color: "#919A96",
    fontSize: 10,
    letterSpacing: 0.6,
    marginTop: 22,
  },
});
