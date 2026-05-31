import { Stack } from "expo-router";
import React from "react";

export default function PedidosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#2563eb",
        headerTitleStyle: { fontWeight: "700", color: "#0f172a" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#f8fafc" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pedidos" }} />
      <Stack.Screen name="novo" options={{ title: "Novo Pedido" }} />
      <Stack.Screen name="[id]" options={{ title: "Pedido" }} />
    </Stack>
  );
}
