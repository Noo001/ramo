import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../theme";

type ProfileStackParamList = {
  Auth: undefined;
  Profile: undefined;
};

type Props = {
  navigation: { replace: (screen: keyof ProfileStackParamList) => void };
};

export function ProfileScreen({ navigation }: Props) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!user) {
    navigation.replace("Auth");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigation.replace("Auth");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/logo-orange.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.name}>{user.name || "Гость"}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Баллы лояльности</Text>
        <Text style={styles.points}>{user.points.toLocaleString("ru-RU")}</Text>
        <Text style={styles.cardHint}>1 балл = 1 ₽</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoLabel}>Телефон</Text>
        <Text style={styles.infoValue}>{user.phone}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
    fontFamily: fonts.sans,
  },
  card: {
    backgroundColor: colors.accentDark,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  cardLabel: {
    color: "#d6d3d1",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fonts.sans,
  },
  points: {
    color: "#fff",
    fontSize: 42,
    fontFamily: fonts.serif,
    fontWeight: "700",
  },
  cardHint: {
    color: "#a8a29e",
    fontSize: 13,
    marginTop: 4,
    fontFamily: fonts.sans,
  },
  info: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 4,
    fontFamily: fonts.sans,
  },
  infoValue: {
    color: colors.foreground,
    fontSize: 16,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: "auto",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  logoutText: {
    color: colors.foreground,
    fontSize: 16,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
});
