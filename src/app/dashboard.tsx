import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useFinance } from "../context/FinanceContext";
import { getDailyTipEnabled } from "../services/remoteConfig";
import { formatBRL } from "../utils/money";
import type { Transaction } from "../types/transaction";

function TransactionRow({ item }: { item: Transaction }) {
  const income = item.type === "income";
  return (
    <View style={styles.row}>
      <View style={[styles.icon, income ? styles.incomeBg : styles.expenseBg]}>
        <Text
          style={[
            styles.iconText,
            income ? styles.incomeText : styles.expenseText,
          ]}
        >
          {income ? "↗" : "↘"}
        </Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>
          {item.category} ·{" "}
          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>
      <Text
        style={[styles.amount, income ? styles.incomeText : styles.expenseText]}
      >
        {income ? "+" : "−"}
        {formatBRL(item.amountCents)}
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { transactions, balanceCents, ready, clearSamples } = useFinance();
  const [showTip, setShowTip] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getDailyTipEnabled().then((enabled) => {
        if (active) setShowTip(enabled);
      });
      return () => {
        active = false;
      };
    }, []),
  );
  const refresh = async () => {
    setRefreshing(true);
    setShowTip(await getDailyTipEnabled());
    setRefreshing(false);
  };
  const removeSamples = () =>
    Alert.alert(
      "Remover dados de exemplo?",
      "Essa ação não remove suas transações pessoais.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            void clearSamples();
          },
        },
      ],
    );

  if (!ready)
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#23594C" />
        <Text style={styles.muted}>Carregando suas finanças…</Text>
      </View>
    );
  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionRow item={item} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>
                  {new Date()
                    .toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    })
                    .toUpperCase()}
                </Text>
                <Text style={styles.greeting}>Olá, Lucas</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.replace("/")}
                style={styles.exit}
              >
                <Text style={styles.exitText}>Sair</Text>
              </Pressable>
            </View>
            {showTip ? (
              <View style={styles.tip}>
                <View style={styles.tipIcon}>
                  <Text style={{ fontSize: 18 }}>✦</Text>
                </View>
                <View style={styles.tipBody}>
                  <Text style={styles.tipTitle}>Dica do Dia</Text>
                  <Text style={styles.tipText}>
                    Pequenos registros diários ajudam a enxergar para onde seu
                    dinheiro vai.
                  </Text>
                </View>
              </View>
            ) : null}
            <View style={styles.balanceCard}>
              <View style={styles.balanceHead}>
                <Text style={styles.balanceLabel}>SALDO ATUAL</Text>
                <Text style={styles.balanceMark}>R$</Text>
              </View>
              <Text style={styles.balance}>{formatBRL(balanceCents)}</Text>
              <Text style={styles.balanceFoot}>
                Calculado com base nas suas movimentações
              </Text>
            </View>
            <View style={styles.sectionHead}>
              <View>
                <Text style={styles.sectionTitle}>Últimas transações</Text>
                <Text style={styles.sectionHint}>
                  {transactions.length} movimentações
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                style={styles.addButton}
                onPress={() => router.push("/transaction")}
              >
                <Text style={styles.addLabel}>＋ Nova</Text>
              </Pressable>
            </View>
            {transactions.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>◷</Text>
                <Text style={styles.emptyTitle}>Tudo começa por aqui</Text>
                <Text style={styles.emptyText}>
                  Adicione sua primeira receita ou despesa.
                </Text>
                <Pressable onPress={() => router.push("/transaction")}>
                  <Text style={styles.emptyAction}>Criar transação</Text>
                </Pressable>
              </View>
            ) : null}
            {transactions.some((item) => item.isSample) ? (
              <Pressable onPress={removeSamples} style={styles.sampleNotice}>
                <Text style={styles.sampleText}>
                  Dados de exemplo ·{" "}
                  <Text style={styles.sampleLink}>remover</Text>
                </Text>
              </Pressable>
            ) : null}
          </>
        }
        ListEmptyComponent={null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#23594C"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },
  content: { padding: 22, paddingBottom: 40 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  eyebrow: {
    color: "#929B97",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  greeting: { color: "#202A27", fontSize: 27, fontWeight: "800", marginTop: 6 },
  exit: {
    minWidth: 54,
    minHeight: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  exitText: { color: "#697570", fontSize: 14, fontWeight: "600" },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5EF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2EBE1",
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#DFEBDD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tipBody: { flex: 1 },
  tipTitle: { color: "#315B45", fontWeight: "700", fontSize: 14 },
  tipText: { color: "#68786C", fontSize: 12, lineHeight: 17, marginTop: 3 },
  balanceCard: {
    backgroundColor: "#23594C",
    borderRadius: 22,
    padding: 22,
    marginBottom: 28,
  },
  balanceHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "#BBD4C8",
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "700",
  },
  balanceMark: { color: "#BBD4C8", fontWeight: "600" },
  balance: { color: "#FFF", fontSize: 34, fontWeight: "800", marginTop: 12 },
  balanceFoot: { color: "#C5D9CF", fontSize: 12, marginTop: 8 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { color: "#202A27", fontSize: 19, fontWeight: "800" },
  sectionHint: { color: "#89928E", marginTop: 4, fontSize: 12 },
  addButton: {
    backgroundColor: "#E7F0EC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    minHeight: 42,
    justifyContent: "center",
  },
  addLabel: { color: "#23594C", fontWeight: "700", fontSize: 13 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDF0EF",
    padding: 14,
    marginTop: 9,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  incomeBg: { backgroundColor: "#E7F4EC" },
  expenseBg: { backgroundColor: "#FBECEB" },
  iconText: { fontSize: 19, fontWeight: "700" },
  incomeText: { color: "#31865C" },
  expenseText: { color: "#C65F52" },
  rowInfo: { flex: 1 },
  description: { color: "#26312D", fontSize: 14, fontWeight: "700" },
  meta: { color: "#8A9490", fontSize: 11, marginTop: 4 },
  amount: { fontSize: 13, fontWeight: "700", marginLeft: 8 },
  empty: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FFF",
    borderRadius: 18,
    marginTop: 12,
  },
  emptyIcon: { fontSize: 28, color: "#769487" },
  emptyTitle: {
    color: "#26312D",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10,
  },
  emptyText: {
    color: "#89928E",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },
  emptyAction: { color: "#23594C", fontWeight: "700", marginTop: 14 },
  sampleNotice: { alignItems: "center", padding: 14 },
  sampleText: { color: "#929B97", fontSize: 11 },
  sampleLink: { color: "#23594C", fontWeight: "700" },
  muted: { color: "#7B8581" },
});
