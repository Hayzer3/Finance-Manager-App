export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseBRL(value: string): number {
  const raw = value.replace(/\s/g, "").replace(/R\$/i, "");
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;
  const amount = Number(normalized);

  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

export function calculateBalance(
  transactions: { type: string; amountCents: number }[],
): number {
  return transactions.reduce(
    (total, transaction) =>
      total +
      (transaction.type === "income"
        ? transaction.amountCents
        : -transaction.amountCents),
    0,
  );
}
