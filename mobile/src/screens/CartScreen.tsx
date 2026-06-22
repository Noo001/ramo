import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api";
import { colors, fonts } from "../theme";

type MenuStackParamList = {
  Menu: undefined;
  Cart: { tableId?: number };
  OrderSuccess: { orderId: number };
};

type Props = {
  navigation: NativeStackNavigationProp<MenuStackParamList, "Cart">;
  route: RouteProp<MenuStackParamList, "Cart">;
};

export function CartScreen({ navigation, route }: Props) {
  const { items, total, updateQuantity, clearCart } = useCart();
  const { user, refresh } = useAuth();
  const [comment, setComment] = useState("");
  const [pointsToSpend, setPointsToSpend] = useState(0);
  const [loading, setLoading] = useState(false);
  const tableId = route.params?.tableId;

  const maxSpendPercent = 30;
  const maxPointsSpend = user ? Math.min(user.points, Math.floor((total * maxSpendPercent) / 100)) : 0;
  const finalTotal = Math.max(0, total - pointsToSpend);

  const submitOrder = async () => {
    if (!tableId) {
      Alert.alert("Ошибка", "Для заказа отсканируйте QR-код на столе");
      return;
    }
    if (items.length === 0) {
      Alert.alert("Ошибка", "Корзина пуста");
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ dishId: i.dish.id, quantity: i.quantity }));
      const res = await createOrder(tableId, orderItems, comment, user ? Math.min(pointsToSpend, maxPointsSpend) : 0);
      clearCart();
      await refresh();
      navigation.replace("OrderSuccess", { orderId: res.orderId });
    } catch (error) {
      Alert.alert("Ошибка", error instanceof Error ? error.message : "Не удалось отправить заказ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Корзина</Text>
      {!tableId ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Отсканируйте QR-код на столе, чтобы сделать заказ</Text>
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.dish.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.dish.name}</Text>
              <Text style={styles.itemPrice}>{(item.dish.price * item.quantity).toLocaleString("ru-RU")} ₽</Text>
            </View>
            <View style={styles.quantityRow}>
              <TouchableOpacity style={styles.qButton} onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}>
                <Text style={styles.qButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qButton} onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}>
                <Text style={styles.qButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Корзина пуста</Text>}
      />

      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Комментарий к заказу"
          value={comment}
          onChangeText={setComment}
          multiline
          placeholderTextColor={colors.muted}
        />
        {user && maxPointsSpend > 0 && (
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Списать баллов (доступно: {user.points})</Text>
            <TextInput
              style={styles.pointsInput}
              keyboardType="number-pad"
              value={pointsToSpend.toString()}
              onChangeText={(text) => {
                const value = Number(text) || 0;
                setPointsToSpend(Math.max(0, Math.min(maxPointsSpend, value)));
              }}
              placeholderTextColor={colors.muted}
            />
            <Text style={styles.pointsHint}>Максимум {maxPointsSpend} ₽</Text>
          </View>
        )}
        {pointsToSpend > 0 && (
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Скидка баллами</Text>
            <Text style={styles.discountValue}>-{pointsToSpend} ₽</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Итого</Text>
          <Text style={styles.total}>{finalTotal.toLocaleString("ru-RU")} ₽</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, (!tableId || items.length === 0) && styles.disabledButton]}
          onPress={submitOrder}
          disabled={!tableId || items.length === 0 || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Отправить заказ</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  banner: {
    backgroundColor: "rgba(255, 132, 0, 0.10)",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
  },
  bannerText: {
    color: colors.accentDark,
    fontSize: 14,
    fontFamily: fonts.sans,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: fonts.serif,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: colors.muted,
    fontFamily: fonts.sans,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  qButtonText: {
    fontSize: 18,
    fontFamily: fonts.sans,
    fontWeight: "600",
    color: colors.foreground,
  },
  quantity: {
    fontSize: 16,
    fontFamily: fonts.sans,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 40,
    fontFamily: fonts.sans,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: colors.foreground,
    minHeight: 60,
    fontFamily: fonts.sans,
  },
  pointsRow: {
    marginBottom: 12,
  },
  pointsLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 6,
    fontFamily: fonts.sans,
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.foreground,
    fontFamily: fonts.sans,
  },
  pointsHint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
    fontFamily: fonts.sans,
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  discountLabel: {
    fontSize: 15,
    color: colors.green,
    fontFamily: fonts.sans,
  },
  discountValue: {
    fontSize: 15,
    color: colors.green,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 17,
    color: colors.muted,
    fontFamily: fonts.sans,
  },
  total: {
    fontSize: 18,
    fontFamily: fonts.sans,
    fontWeight: "700",
    color: colors.foreground,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
});
