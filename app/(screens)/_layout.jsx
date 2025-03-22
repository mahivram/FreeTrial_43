import { Stack } from "expo-router";

const ScreenLayout = () => {
  return ( 
    
    <Stack
    screenOptions={{ headerShown: true }}>
    
    <Stack.Screen
      name="jobs"
      options={{ title: "Jobs", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="financialeducation"
      options={{ title: "financialeducation", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="selfcare"
      options={{ title: "Selfcare", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="financialtool"
      options={{ title: "FinancialTool", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="governmentschemes"
      options={{ title: "governmentschemes", headerTitleAlign: "center" }}
    />
  </Stack>

  );
};

export default ScreenLayout;
