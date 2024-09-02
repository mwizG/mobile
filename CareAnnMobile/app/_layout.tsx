// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(screens)/Home" />
      <Stack.Screen name="(screens)/Login" /> 
      <Stack.Screen name="(components)/Dashboard/CaregiverDashboard" />
      <Stack.Screen name="(components)/Dashboard/CareSeekerDashboard" />
      
    </Stack>
  );
}