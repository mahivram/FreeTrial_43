import { Tabs, Stack } from "expo-router";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#4a90e2',
      tabBarInactiveTintColor: '#666',
    }}>
      <Tabs.Screen 
        name="home" 
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="tab2" 
        options={{
          title: "Tab 2",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
};

export default TabLayout;
