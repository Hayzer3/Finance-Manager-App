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
import { useFinance } from "../context/FinanceContext";
import type { TransactionType } from "../types/transaction";
import { parseBRL } from "../utils/money";
import { validateTransaction } from "../utils/validation";

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Salário",
  "Outros",
];

export default function TransactionScreen() {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    const amountCents = parseBRL(amount);
    const validationError = validateTransaction(
      amountCents,
      description,
      category,
    );
    if (validationError) return setError(validationError);
    setSaving(true);
    setError("");
    try {
      await addTransaction({
        type,
        amountCents,
        description: description.trim(),
        category,
      });
      router.replace("/dashboard");
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };
  const cancel = () => {
    if (amount || description || category)
      Alert.alert(
        "Descartar alterações?",
        "Os dados preenchidos serão perdidos.",
        [
          { text: "Continuar editando", style: "cancel" },
          {
            text: "Descartar",
            style: "destructive",
            onPress: () => router.back(),
          },
        ],
      );
    else router.back();
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
        <Pressable onPress={cancel} style={styles.back}>
          <Text style={styles.backText}>‹ Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Nova Transação</Text>
        <Text style={styles.subtitle}>
          Registre uma entrada ou saída do seu dinheiro.
        </Text>
        <View style={styles.form}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.segment}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setType("expense")}
              style={[
                styles.segmentItem,
                type === "expense" && styles.selected,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  type === "expense" && styles.selectedText,
                ]}
              >
                Despesa
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setType("income")}
              style={[
                styles.segmentItem,
                type === "income" && styles.selectedIncome,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  type === "income" && styles.incomeText,
                ]}
              >
                Receita
              </Text>
            </Pressable>
          </View>
          <Text style={styles.label}>Valor</Text>
          <View style={styles.moneyInput}>
            <Text style={styles.currency}>R$</Text>
            <TextInput
              accessibilityLabel="Valor em reais"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0,00"
              style={styles.moneyText}
            />
          </View>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Ex.: Conta de luz"
            maxLength={60}
            style={styles.input}
          />
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categories}>
            {categories.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item}
                onPress={() => setCategory(item)}
                style={[
                  styles.category,
                  category === item && styles.categorySelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          <ActionButton
            title="Salvar Transação"
            onPress={save}
            loading={saving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { padding: 22, paddingTop: 26, paddingBottom: 40 },
  back: { alignSelf: "flex-start", minHeight: 42, justifyContent: "center" },
  backText: { color: "#23594C", fontSize: 15, fontWeight: "700" },
  title: { color: "#202A27", fontSize: 26, fontWeight: "800", marginTop: 14 },
  subtitle: { color: "#7B8581", fontSize: 14, marginTop: 6, marginBottom: 22 },
  form: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E9ECEB",
    borderRadius: 22,
    padding: 20,
  },
  label: {
    color: "#46514D",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
    marginTop: 16,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#F4F6F5",
    padding: 4,
    borderRadius: 14,
  },
  segmentItem: {
    flex: 1,
    minHeight: 46,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { backgroundColor: "#FBECEB" },
  selectedIncome: { backgroundColor: "#E7F4EC" },
  segmentText: { color: "#7B8581", fontWeight: "700" },
  selectedText: { color: "#C65F52" },
  incomeText: { color: "#31865C" },
  moneyInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7EBE9",
    backgroundColor: "#F8F9F9",
    borderRadius: 13,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  currency: { color: "#737D79", fontSize: 15, fontWeight: "600" },
  moneyText: {
    flex: 1,
    paddingLeft: 10,
    color: "#202A27",
    fontSize: 22,
    fontWeight: "700",
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#E7EBE9",
    backgroundColor: "#F8F9F9",
    borderRadius: 13,
    paddingHorizontal: 14,
    color: "#202A27",
    fontSize: 15,
  },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  category: {
    borderWidth: 1,
    borderColor: "#E5EAE8",
    paddingHorizontal: 12,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
  categorySelected: { backgroundColor: "#E7F0EC", borderColor: "#9DBCAF" },
  categoryText: { fontSize: 12, color: "#66716C", fontWeight: "600" },
  categoryTextSelected: { color: "#23594C" },
  error: { color: "#B42318", marginVertical: 14, fontSize: 13 },
});
