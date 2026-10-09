import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTransactionStorage } from "./transactionStore";

const transactionStorage = createTransactionStorage(AsyncStorage);
export const loadTransactions = transactionStorage.load;
export const saveTransactions = transactionStorage.save;
