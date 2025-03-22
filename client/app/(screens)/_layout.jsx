import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: "center",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="skillTutorials"
        options={({ route }) => ({
          title: route.params?.skill || "Tutorials",
          headerTitleAlign: "center",
        })}
      />
      <Stack.Screen
        name="videoPlayer"
        options={{
          title: "Video Player",
          headerTitleAlign: "center",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="skillDetails"
        options={({ route }) => ({
          title: route.params?.skill || "Skill Details",
          headerTitleAlign: "center",
        })}
      />
      <Stack.Screen
        name="communityPost"
        options={{
          title: "Community Post",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="productDetails"
        options={{
          title: "Product Details",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="emergency"
        options={{
          title: "Emergency",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: '#ff4444',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
