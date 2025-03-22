import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, View, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 60,
          paddingHorizontal: 16,
          paddingBottom: Platform.OS === "ios" ? 28 : 55,
          paddingTop: 8,
          backgroundColor: colors.common.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarIconStyle: {
          marginBottom: Platform.OS === 'ios' ? 0 : -4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: Platform.OS === 'ios' ? 0 : -4,
        },
        tabBarButton: (props) => {
          const { accessibilityState, style, onPress } = props;
          const isSelected = accessibilityState?.selected;

          return (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={onPress}
                style={[
                  {
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 8,
                    width: '100%',
                    position: 'relative',
                  },
                  style,
                ]}>
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: isSelected ? `${colors.primary.main}15` : 'transparent',
                    transform: [{ scale: isSelected ? 1 : 0.8 }],
                  }}
                />
                {props.children}
              </TouchableOpacity>
            </View>
          );
        },
      }}
    >
      <Tabs.Screen
        name="SkillLearningScreen"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="school" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="MarketplaceScreen"
        options={{
          title: "Marketplace",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="store" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="CommunityScreen"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="EmergencyScreen"
        options={{
          title: "Emergency",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="phone-alert"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
