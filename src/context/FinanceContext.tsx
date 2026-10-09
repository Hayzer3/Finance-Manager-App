import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { loadTransactions, saveTransactions } from "../services/storage";
import type { NewTransaction, Transaction } from "../types/transaction";
import { calculateBalance } from "../utils/money";

const samples: Transaction[] = [
  {
    id: "sample-1",
    type: "income",
    amountCents: 250000,
    description: "Bolsa estágio",
    category: "Salário",
    createdAt: new Date().toISOString(),
    isSample: true,
  },
  {
    id: "sample-2",
    type: "expense",
    amountCents: 3850,
    description: "Almoço",
    category: "Alimentação",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isSample: true,
  },
  {
    id: "sample-3",
    type: "expense",
    amountCents: 1290,
    description: "Ônibus",
    category: "Transporte",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isSample: true,
  },
];

type FinanceValue = {
  transactions: Transaction[];
  ready: boolean;
  addTransaction: (item: NewTransaction) => Promise<void>;
  clearSamples: () => Promise<void>;
};
const FinanceContext = createContext<FinanceValue | null>(null);

export function FinanceProvider({ children }: React.PropsWithChildren) {
  const [transactions, setTransactions] = useState<Transaction[]>(samples);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadTransactions()
      .then((saved) => {
        if (saved) setTransactions(saved);
        setReady(true);
      })
      .catch(() => {
        Alert.alert(
          "Armazenamento indisponível",
          "Não foi possível carregar os dados salvos.",
        );
        setReady(true);
      });
  }, []);

  const addTransaction = useCallback(
    async (item: NewTransaction) => {
      const next = [
        {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
        },
        ...transactions,
      ];
      await saveTransactions(next);
      setTransactions(next);
    },
    [transactions],
  );

  const clearSamples = useCallback(async () => {
    const next = transactions.filter((transaction) => !transaction.isSample);
    await saveTransactions(next);
    setTransactions(next);
  }, [transactions]);

  const value = useMemo(
    () => ({ transactions, ready, addTransaction, clearSamples }),
    [transactions, ready, addTransaction, clearSamples],
  );
  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const value = useContext(FinanceContext);
  if (!value)
    throw new Error("useFinance precisa estar dentro de FinanceProvider.");
  return { ...value, balanceCents: calculateBalance(value.transactions) };
}
