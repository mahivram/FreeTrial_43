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
        name="skills" 
        options={{
          title: "Skills",
          tabBarIcon: ({ color, size }) => (
        <Ionicons name="star" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="market" 
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => (
        <Ionicons name="cart" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="emergency" 
        options={{
          title: "Emergency",
          tabBarIcon: ({ color, size }) => (
        <Ionicons name="warning" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="community" 
        options={{
          title: "Community",
          tabBarIcon: ({ color, size }) => (
        <Ionicons name="people" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
};

export default TabLayout;
