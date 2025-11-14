import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#494949ff' },
      headerShown: false,
      tabBarActiveTintColor: '#e9de14ff', tabBarInactiveTintColor: '#858c00ff'
    }}
      initialRouteName="index">
      <Tabs.Screen
      name="index"
      options={{
        title: 'Início',
        tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} size={28} />
        }} />

      <Tabs.Screen
        name="search"
        options={{
          title: "Pesquisar",
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" color={color} size={28} />
        }} />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" color={color} size={28} />
        }} />
      
      <Tabs.Screen
        name="index/index"
        options={{ href: null }} />
      
      <Tabs.Screen
        name="filme/[id]"
         options={{ href: null }} />
      </Tabs>
  )
}