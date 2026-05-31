import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="clientes">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>Clientes</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="pedidos">
        <Icon sf={{ default: "bag", selected: "bag.fill" }} />
        <Label>Pedidos</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="anotacoes">
        <Icon sf={{ default: "note.text", selected: "note.text" }} />
        <Label>Anotações</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: colors.background,
          borderTopWidth: 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...({}),
        },
      }}
    >
      <Tabs.Screen
        name="clientes"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color }) => (
              <Feather name="users" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color }) => (
              <Feather name="shopping-bag" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="anotacoes"
        options={{
          title: "Anotações",
          tabBarIcon: ({ color }) => (
              <Feather name="file-text" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
