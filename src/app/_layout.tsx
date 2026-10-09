import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FinanceProvider } from "../context/FinanceContext";

export default function RootLayout() {
  return (
    <FinanceProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F7F8FA" },
        }}
      />
    </FinanceProvider>
  );
}
