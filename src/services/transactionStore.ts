import type { Transaction } from "../types/transaction";

const KEY = "@finance-manager/transactions-v1";

export function createTransactionStorage(storage: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}) {
  return {
    async load(): Promise<Transaction[] | null> {
      const saved = await storage.getItem(KEY);
      return saved ? (JSON.parse(saved) as Transaction[]) : null;
    },
    async save(transactions: Transaction[]): Promise<void> {
      await storage.setItem(KEY, JSON.stringify(transactions));
    },
  };
}
