import React, { useEffect, useState } from "react";
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
import { fetchTables, fetchReservations, createReservation } from "../api";
import { Table, Reservation } from "../types";
import { colors, fonts } from "../theme";

const zones: { key: Table["zone"]; label: string }[] = [
  { key: "HALL1", label: "Зал 1" },
  { key: "HALL2", label: "Зал 2" },
  { key: "TERRACE", label: "Терраса" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}

export function BookingScreen() {
  const [tables, setTables] = useState<Table[]>([]);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("19:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedZone, setSelectedZone] = useState<Table["zone"]>("HALL1");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTables().then(setTables).catch(console.error);
  }, []);

  const submit = async () => {
    if (!name || !phone || !guests || !time) {
      Alert.alert("Ошибка", "Заполните все обязательные поля");
      return;
    }

    setLoading(true);
    try {
      const reservations = await fetchReservations(date);
      const reservedIds = new Set(reservations.map((r) => r.tableId));
      const guestCount = Number(guests);

      const available = tables.filter(
        (t) => t.zone === selectedZone && t.isActive && !reservedIds.has(t.id) && t.seats >= guestCount
      );

      if (available.length === 0) {
        Alert.alert("Нет свободных столов", "Попробуйте другую дату, время или зону");
        setLoading(false);
        return;
      }

      const table = available.sort((a, b) => a.seats - b.seats)[0];
      await createReservation({
        tableId: table.id,
        name,
        phone,
        guests: guestCount,
        date,
        time,
        comment,
      });
      Alert.alert("Готово", `Забронирован стол №${table.id} на ${date} ${time}`);
    } catch (error) {
      Alert.alert("Ошибка", error instanceof Error ? error.message : "Не удалось создать бронирование");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Забронировать стол</Text>

        <Text style={styles.label}>Дата</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-01-01" placeholderTextColor={colors.muted} />

        <Text style={styles.label}>Время</Text>
        <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="19:00" placeholderTextColor={colors.muted} />

        <Text style={styles.label}>Зона</Text>
        <View style={styles.zoneRow}>
          {zones.map((z) => (
            <TouchableOpacity
              key={z.key}
              style={[styles.zoneChip, selectedZone === z.key && styles.zoneChipActive]}
              onPress={() => setSelectedZone(z.key)}
            >
              <Text style={[styles.zoneText, selectedZone === z.key && styles.zoneTextActive]}>{z.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

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

        <Text style={styles.label}>Гостей</Text>
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
          placeholder="Пожелания"
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
    marginBottom: 16,
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
  zoneRow: {
    flexDirection: "row",
    gap: 8,
  },
  zoneChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    alignItems: "center",
  },
  zoneChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  zoneText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
  zoneTextActive: {
    color: "#fff",
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
