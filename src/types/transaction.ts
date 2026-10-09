export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  amountCents: number;
  description: string;
  category: string;
  createdAt: string;
  isSample?: boolean;
};

export type NewTransaction = Omit<Transaction, "id" | "createdAt" | "isSample">;
