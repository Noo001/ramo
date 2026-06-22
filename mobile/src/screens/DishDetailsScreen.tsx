import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { Dish } from "../types";
import { colors, fonts } from "../theme";

type MenuStackParamList = {
  Menu: undefined;
  DishDetails: { dish: Dish };
  Cart: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<MenuStackParamList, "DishDetails">;
  route: RouteProp<MenuStackParamList, "DishDetails">;
};

export function DishDetailsScreen({ route }: Props) {
  const { dish } = route.params;
  const { addToCart, items, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.dish.id === dish.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {dish.image && <Image source={{ uri: dish.image }} style={styles.image} resizeMode="cover" />}
        <Text style={styles.name}>{dish.name}</Text>
        {dish.description ? <Text style={styles.description}>{dish.description}</Text> : null}
        <View style={styles.row}>
          <Text style={styles.price}>{dish.price.toLocaleString("ru-RU")} ₽</Text>
          {dish.weight ? <Text style={styles.weight}>{dish.weight}</Text> : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {dish.isStopListed ? (
          <View style={[styles.button, styles.disabledButton]}>
            <Text style={styles.buttonText}>Нет в наличии</Text>
          </View>
        ) : cartItem ? (
          <View style={styles.quantityRow}>
            <TouchableOpacity style={styles.qButton} onPress={() => updateQuantity(dish.id, cartItem.quantity - 1)}>
              <Text style={styles.qButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{cartItem.quantity}</Text>
            <TouchableOpacity style={styles.qButton} onPress={() => addToCart(dish)}>
              <Text style={styles.qButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => addToCart(dish)}>
            <Text style={styles.buttonText}>Добавить в корзину</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: fonts.sans,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  price: {
    fontSize: 22,
    fontFamily: fonts.sans,
    fontWeight: "700",
    color: colors.foreground,
  },
  weight: {
    fontSize: 16,
    color: colors.muted,
    fontFamily: fonts.sans,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#d6d3d1",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  qButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  qButtonText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: fonts.sans,
    fontWeight: "600",
    lineHeight: 28,
  },
  quantity: {
    fontSize: 20,
    fontFamily: fonts.sans,
    fontWeight: "700",
    minWidth: 30,
    textAlign: "center",
  },
});
