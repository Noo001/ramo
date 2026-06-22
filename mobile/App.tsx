import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { CartProvider } from "./src/context/CartContext";
import { AuthProvider } from "./src/context/AuthContext";
import { MenuScreen } from "./src/screens/MenuScreen";
import { DishDetailsScreen } from "./src/screens/DishDetailsScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { OrderSuccessScreen } from "./src/screens/OrderSuccessScreen";
import { QRScannerScreen } from "./src/screens/QRScannerScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { ReservationScreen } from "./src/screens/ReservationScreen";
import { BookingScreen } from "./src/screens/BookingScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { Dish, Table } from "./src/types";
import { colors } from "./src/theme";

type MenuStackParamList = {
  Menu: { tableId?: string } | undefined;
  DishDetails: { dish: Dish };
  Cart: { tableId?: number };
  OrderSuccess: { orderId: number };
  QRScanner: undefined;
};

type MapStackParamList = {
  Map: undefined;
  Reservation: { table: Table; date: string };
};

type ProfileStackParamList = {
  Auth: undefined;
  Profile: undefined;
};

type TabParamList = {
  Меню: undefined;
  Карта: undefined;
  Бронь: undefined;
  Профиль: undefined;
};

const MenuStack = createNativeStackNavigator<MenuStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MenuStackScreen() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="Menu" component={MenuScreen} />
      <MenuStack.Screen name="DishDetails" component={DishDetailsScreen} />
      <MenuStack.Screen name="Cart" component={CartScreen} />
      <MenuStack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <MenuStack.Screen name="QRScanner" component={QRScannerScreen} />
    </MenuStack.Navigator>
  );
}

function MapStackScreen() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Screen name="Reservation" component={ReservationScreen} />
    </MapStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Auth" component={AuthScreen} />
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Меню: "🍽",
    Карта: "🗺",
    Бронь: "📅",
    Профиль: "👤",
  };
  return <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{icons[label] || label}</Text>;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Geist: require("./assets/Geist-Regular.ttf"),
    "Geist-Medium": require("./assets/Geist-Medium.ttf"),
    "Geist-SemiBold": require("./assets/Geist-SemiBold.ttf"),
    "Geist-Bold": require("./assets/Geist-Bold.ttf"),
    LibertinusSerif: require("./assets/LibertinusSerif-Regular.ttf"),
    "LibertinusSerif-Bold": require("./assets/LibertinusSerif-Bold.ttf"),
    FRBAmericanCursive: require("./assets/FRBAmericanCursive-400-Regular.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
                tabBarLabel: ({ focused }) => (
                  <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{route.name}</Text>
                ),
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.muted,
              })}
            >
              <Tab.Screen name="Меню" component={MenuStackScreen} />
              <Tab.Screen name="Карта" component={MapStackScreen} />
              <Tab.Screen name="Бронь" component={BookingScreen} />
              <Tab.Screen name="Профиль" component={ProfileStackScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: 6,
    paddingBottom: 8,
    height: 64,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    fontFamily: "Geist",
  },
  tabLabelFocused: {
    color: colors.accent,
    fontFamily: "Geist-SemiBold",
  },
});
