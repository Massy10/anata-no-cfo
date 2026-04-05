import { Stack } from 'expo-router';

export default function ExpenseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="sub/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="loan/[id]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
