import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Category } from "../types";
import { colors, fonts } from "../theme";

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CategoryList({ categories, selectedId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const active = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, active && styles.activeChip]}
            onPress={() => onSelect(cat.id)}
          >
            <Text style={[styles.text, active && styles.activeText]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(38, 33, 31, 0.06)",
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: colors.accent,
  },
  text: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
});
