import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import CartItem from '../components/CartItem';
import { globalStyles } from '../components/style';
import { getCartItems, getStock, removeFromCart, updateQuantity } from '../db/db';

export default function CartScreen() {

  interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
  }
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = getCartItems();
    setCartItems(items);
    const tempTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(tempTotal);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;

    if (delta > 0) {
      const stock = getStock(item.product_id);
      if (stock <= 0) {
        Alert.alert('Lỗi', 'Hết hàng, không thể tăng!');
        return;
      }
    }

    if (newQty <= 0) {
      handleRemove(id);
      return;
    }

    updateQuantity(id, newQty);
    loadCart();
  };

  const handleRemove = (id: number) => {
    Alert.alert('Xác nhận', 'Xóa sản phẩm?', [
      { text: 'Hủy' },
      {
        text: 'OK',
        onPress: () => {
          removeFromCart(id);
          loadCart();
        },
      },
    ]);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Giỏ Hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        )}
      />
      <Text style={globalStyles.totalText}>Tổng tạm: {total.toLocaleString('vi-VN')}</Text>
      <Link href="/invoice" style={globalStyles.linkText}>
        Xem hóa đơn
      </Link>
    </View>
  );
}