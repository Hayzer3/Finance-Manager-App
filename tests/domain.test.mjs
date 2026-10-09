import test from "node:test";
import assert from "node:assert/strict";
import { formatBRL, parseBRL, calculateBalance } from "../src/utils/money.ts";
import {
  validateCredentials,
  validateRegistration,
  validateTransaction,
} from "../src/utils/validation.ts";
import { createTransactionStorage } from "../src/services/transactionStore.ts";
import {
  DAILY_TIP_DEFAULT,
  resolveDailyTipEnabled,
} from "../src/services/remoteConfig.ts";

test("parses and formats Brazilian currency without floating point balance errors", () => {
  assert.equal(parseBRL("1.450,00"), 145000);
  assert.equal(parseBRL("1.5"), 150);
  assert.equal(formatBRL(145000), "R$ 1.450,00");
  assert.equal(
    calculateBalance([
      { type: "income", amountCents: 10000 },
      { type: "expense", amountCents: 1750 },
    ]),
    8250,
  );
});

test("validates sign-in, registration and transaction fields", () => {
  assert.equal(validateCredentials("lucas@email.com", "senha123"), null);
  assert.equal(
    validateCredentials("invalido", "senha123"),
    "Informe um e-mail válido.",
  );
  assert.equal(
    validateRegistration("", "a@b.com", "123456"),
    "Informe seu nome.",
  );
  assert.equal(
    validateTransaction(0, "Almoço", "Alimentação"),
    "Informe um valor maior que zero.",
  );
  assert.equal(
    validateTransaction(4500, "", "Alimentação"),
    "Informe uma descrição.",
  );
  assert.equal(
    validateTransaction(4500, "Almoço", ""),
    "Escolha uma categoria.",
  );
  assert.equal(validateTransaction(4500, "Almoço", "Alimentação"), null);
});

test("saves and recovers transactions through the local storage adapter", async () => {
  const memory = new Map();
  const storage = createTransactionStorage({
    getItem: async (key) => memory.get(key) ?? null,
    setItem: async (key, value) => memory.set(key, value),
  });
  const transactions = [
    {
      id: "t1",
      type: "income",
      amountCents: 10000,
      description: "Bolsa",
      category: "Salário",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  assert.equal(await storage.load(), null);
  await storage.save(transactions);
  assert.deepEqual(await storage.load(), transactions);
});

test("honors either Remote Config value and uses the visible fallback on failure", async () => {
  assert.equal(await resolveDailyTipEnabled(async () => true), true);
  assert.equal(await resolveDailyTipEnabled(async () => false), false);
  assert.equal(
    await resolveDailyTipEnabled(async () => {
      throw new Error("Firebase unavailable");
    }),
    DAILY_TIP_DEFAULT,
  );

  let nativeCallMade = false;
  assert.equal(
    await resolveDailyTipEnabled(async () => {
      nativeCallMade = true;
      return false;
    }, true),
    DAILY_TIP_DEFAULT,
  );
  assert.equal(nativeCallMade, false);
});
