import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

export function ActionButton({
  title,
  onPress,
  loading = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? "#285F52" : "#FFF"} />
      ) : (
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#23594C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  secondary: { backgroundColor: "#E8F1EE" },
  pressed: { opacity: 0.84 },
  label: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  secondaryLabel: { color: "#23594C" },
});
