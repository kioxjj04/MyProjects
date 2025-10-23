import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sản Phẩm' }} />
      <Stack.Screen name="cart" options={{ title: 'Giỏ Hàng' }} />
      <Stack.Screen name="invoice" options={{ title: 'Hóa Đơn' }} />
    </Stack>
  );
}