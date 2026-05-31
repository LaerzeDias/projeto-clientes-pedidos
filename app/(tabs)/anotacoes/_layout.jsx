import { Stack } from "expo-router";
import React from "react";

export default function AnotacoesLayout() {
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
      <Stack.Screen name="index" options={{ title: "Anotações" }} />
      <Stack.Screen name="nova" options={{ title: "Nova Anotação" }} />
      <Stack.Screen name="[id]" options={{ title: "Anotação" }} />
    </Stack>
  );
}
