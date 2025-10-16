import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface OfflineBannerProps {
  isVisible: boolean;
  queueLength?: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isVisible, queueLength = 0 }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>You&apos;re offline</Text>
        {queueLength > 0 && (
          <Text style={styles.subtitle}>
            {queueLength} {queueLength === 1 ? "expense" : "expenses"} queued for sync
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FED7D7",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F56565",
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#742A2A",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#9B2C2C",
  },
});
