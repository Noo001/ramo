import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Dish } from "../types";
import { colors, fonts } from "../theme";

interface Props {
  dish: Dish;
  onPress: () => void;
  onAdd: () => void;
}

export function DishCard({ dish, onPress, onAdd }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {dish.image && <Image source={{ uri: dish.image }} style={styles.image} resizeMode="cover" />}
      <View style={styles.content}>
        <Text style={styles.name}>{dish.name}</Text>
        {dish.description ? <Text style={styles.description} numberOfLines={2}>{dish.description}</Text> : null}
        <View style={styles.footer}>
          <Text style={styles.price}>{dish.price.toLocaleString("ru-RU")} ₽</Text>
          {dish.weight ? <Text style={styles.weight}>{dish.weight}</Text> : null}
        </View>
        {dish.isStopListed ? (
          <Text style={styles.stopList}>Нет в наличии</Text>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 17,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: fonts.sans,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.sans,
    fontWeight: "700",
    color: colors.foreground,
  },
  weight: {
    fontSize: 14,
    color: colors.muted,
    fontFamily: fonts.sans,
  },
  stopList: {
    color: "#dc2626",
    fontFamily: fonts.sans,
    fontWeight: "600",
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: fonts.sans,
    fontWeight: "600",
    lineHeight: 26,
  },
});
