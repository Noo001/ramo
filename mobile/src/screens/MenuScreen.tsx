import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DishCard } from "../components/DishCard";
import { CategoryList } from "../components/CategoryList";
import { useCart } from "../context/CartContext";
import { fetchMenu } from "../api";
import { Category, Dish } from "../types";
import { colors, fonts } from "../theme";

type MenuStackParamList = {
  Menu: { tableId?: string } | undefined;
  DishDetails: { dish: Dish };
  Cart: { tableId?: number } | undefined;
  QRScanner: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<MenuStackParamList, "Menu">;
  route: { params?: { tableId?: string } };
};

export function MenuScreen({ navigation, route }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart, count } = useCart();

  const tableId = route.params?.tableId ? Number(route.params.tableId) : undefined;

  const loadMenu = async () => {
    try {
      const data = await fetchMenu();
      setCategories(data);
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const dishes = selectedCategory?.dishes.filter((d) => d.isActive) || [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image source={require("../../assets/logo-brown.png")} style={styles.logo} resizeMode="contain" />
          {tableId ? <Text style={styles.subtitle}>Стол №{tableId}</Text> : null}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("QRScanner")}>
            <Text style={styles.iconText}>QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart", { tableId })}>
            <Text style={styles.iconText}>🛒</Text>
            {count > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <CategoryList
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadMenu(); }} />}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onPress={() => navigation.navigate("DishDetails", { dish: item })}
            onAdd={() => !item.isStopListed && addToCart(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Нет блюд в категории</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 100,
    height: 32,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
    fontFamily: fonts.sans,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
    fontFamily: fonts.sans,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.accentDark,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: fonts.sans,
    fontWeight: "700",
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 40,
    fontFamily: fonts.sans,
  },
});
