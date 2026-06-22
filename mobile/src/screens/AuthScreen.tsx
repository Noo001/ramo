import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../theme";

type ProfileStackParamList = {
  Auth: undefined;
  Profile: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "Auth">;
};

export function AuthScreen({ navigation }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      if (mode === "login") {
        await login(phone, password);
      } else {
        await register(phone, password, name);
      }
      navigation.replace("Profile");
    } catch (error) {
      Alert.alert("Ошибка", error instanceof Error ? error.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/logo-orange.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>{mode === "login" ? "Вход" : "Регистрация"}</Text>
      <Text style={styles.subtitle}>В личный кабинет</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggle, mode === "login" && styles.toggleActive]} onPress={() => setMode("login")}>
          <Text style={[styles.toggleText, mode === "login" && styles.toggleTextActive]}>Вход</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, mode === "register" && styles.toggleActive]} onPress={() => setMode("register")}>
          <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>Регистрация</Text>
        </TouchableOpacity>
      </View>

      {mode === "register" && (
        <TextInput style={styles.input} placeholder="Имя" value={name} onChangeText={setName} placeholderTextColor={colors.muted} />
      )}
      <TextInput
        style={styles.input}
        placeholder="Телефон"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
        placeholderTextColor={colors.muted}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.muted}
      />

      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{mode === "login" ? "Войти" : "Зарегистрироваться"}</Text>}
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
  logo: {
    width: 120,
    height: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 24,
    fontFamily: fonts.sans,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  toggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(38, 33, 31, 0.06)",
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: 12,
    fontFamily: fonts.sans,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
});
