import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchTables, fetchReservations } from "../api";
import { Table, Reservation } from "../types";
import { colors, fonts } from "../theme";

type MapStackParamList = {
  Map: undefined;
  Reservation: { table: Table; date: string };
};

type Props = {
  navigation: NativeStackNavigationProp<MapStackParamList, "Map">;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

const zoneLabels: Record<string, string> = {
  HALL1: "Зал 1",
  HALL2: "Зал 2",
  TERRACE: "Терраса",
};

export function MapScreen({ navigation }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [tablesData, resData] = await Promise.all([fetchTables(), fetchReservations(date)]);
      setTables(tablesData);
      setReservations(resData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

  const zones = Array.from(new Set(tables.map((t) => t.zone)));
  const reservedIds = new Set(reservations.map((r) => r.tableId));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Карта зала</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity onPress={() => {
          const d = new Date(date);
          d.setDate(d.getDate() - 1);
          setDate(d.toISOString().split("T")[0]);
        }}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.date}>{date.split("-").reverse().join(".")}</Text>
        <TouchableOpacity onPress={() => {
          const d = new Date(date);
          d.setDate(d.getDate() + 1);
          setDate(d.toISOString().split("T")[0]);
        }}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={zones}
        keyExtractor={(z) => z}
        contentContainerStyle={styles.list}
        renderItem={({ item: zone }) => (
          <View style={styles.zone}>
            <Text style={styles.zoneTitle}>{zoneLabels[zone] || zone}</Text>
            <View style={styles.tables}>
              {tables
                .filter((t) => t.zone === zone)
                .map((table) => {
                  const reserved = reservedIds.has(table.id);
                  return (
                    <TouchableOpacity
                      key={table.id}
                      style={[styles.table, reserved && styles.tableReserved]}
                      disabled={reserved}
                      onPress={() => navigation.navigate("Reservation", { table, date })}
                    >
                      <Text style={[styles.tableNumber, reserved && styles.tableNumberReserved]}>{table.id}</Text>
                      <Text style={styles.seats}>{table.seats} мест</Text>
                      {reserved ? <Text style={styles.reservedText}>Занят</Text> : null}
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  arrow: {
    fontSize: 20,
    color: colors.foreground,
    fontWeight: "700",
    paddingHorizontal: 12,
    fontFamily: fonts.sans,
  },
  date: {
    fontSize: 17,
    fontFamily: fonts.sans,
    fontWeight: "600",
    color: colors.foreground,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  zone: {
    marginBottom: 20,
  },
  zoneTitle: {
    fontSize: 18,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 10,
  },
  tables: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  table: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tableReserved: {
    backgroundColor: "rgba(190, 0, 0, 0.1)",
  },
  tableNumber: {
    fontSize: 22,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.foreground,
  },
  tableNumberReserved: {
    color: colors.red,
  },
  seats: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    fontFamily: fonts.sans,
  },
  reservedText: {
    fontSize: 11,
    color: colors.red,
    marginTop: 4,
    fontFamily: fonts.sans,
    fontWeight: "600",
  },
});
