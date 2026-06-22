import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { createReservation } from "../api";
import { Table } from "../types";
import { colors, fonts } from "../theme";

type MapStackParamList = {
  Map: undefined;
  Reservation: { table: Table; date: string };
};

type Props = {
  navigation: NativeStackNavigationProp<MapStackParamList, "Reservation">;
  route: RouteProp<MapStackParamList, "Reservation">;
};

export function ReservationScreen({ navigation, route }: Props) {
  const { table, date } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(table.seats.toString());
  const [time, setTime] = useState("19:00");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !phone || !guests || !time) {
      Alert.alert("Ошибка", "Заполните все обязательные поля");
      return;
    }
    setLoading(true);
    try {
      await createReservation({
        tableId: table.id,
        name,
        phone,
        guests: Number(guests),
        date,
        time,
        comment,
      });
      Alert.alert("Готово", `Стол №${table.id} забронирован на ${date} ${time}`, [
        { text: "OK", onPress: () => navigation.navigate("Map") },
      ]);
    } catch (error) {
      Alert.alert("Ошибка", error instanceof Error ? error.message : "Не удалось создать бронирование");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Бронирование</Text>
        <Text style={styles.subtitle}>
          Стол №{table.id} · {table.seats} мест · {date.split("-").reverse().join(".")}
        </Text>

        <Text style={styles.label}>Время</Text>
        <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="19:00" placeholderTextColor={colors.muted} />

        <Text style={styles.label}>Имя</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Иван Иванов" placeholderTextColor={colors.muted} />

        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+7 (900) 000-00-00"
          keyboardType="phone-pad"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Количество гостей</Text>
        <TextInput
          style={styles.input}
          value={guests}
          onChangeText={setGuests}
          placeholder="2"
          keyboardType="number-pad"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Комментарий</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={comment}
          onChangeText={setComment}
          placeholder="Пожелания по столику"
          multiline
          placeholderTextColor={colors.muted}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Забронировать</Text>}
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
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 20,
    fontFamily: fonts.sans,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.sans,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.foreground,
    fontFamily: fonts.sans,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  footer: {
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
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
});
