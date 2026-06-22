import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { colors, fonts } from "../theme";

type MenuStackParamList = {
  Menu: undefined;
  OrderSuccess: { orderId: number };
};

type Props = {
  navigation: NativeStackNavigationProp<MenuStackParamList, "OrderSuccess">;
  route: RouteProp<MenuStackParamList, "OrderSuccess">;
};

export function OrderSuccessScreen({ navigation, route }: Props) {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.title}>Заказ отправлен</Text>
        <Text style={styles.subtitle}>Номер заказа: #{orderId}</Text>
        <Text style={styles.hint}>Официант скоро подойдёт к вашему столу</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Menu")}>
        <Text style={styles.buttonText}>Вернуться в меню</Text>
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
  icon: {
    fontSize: 64,
    color: colors.green,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: colors.muted,
    marginBottom: 8,
    fontFamily: fonts.sans,
  },
  hint: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    fontFamily: fonts.sans,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
});
