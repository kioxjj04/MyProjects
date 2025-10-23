import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Switch, Text, View } from 'react-native';
import { globalStyles } from '../components/style';
import { clearCart, getCartItems } from '../db/db';

export default function InvoiceScreen() {

  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [date, setDate] = useState(new Date().toLocaleString('vi-VN'));
  const [applyVat, setApplyVat] = useState(true); // VAT toggle state

  useEffect(() => {
    const cartItems = getCartItems();
    setItems(cartItems);

    const tempTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tempVat = applyVat ? tempTotal * 0.1 : 0;
    const tempGrand = tempTotal + tempVat;

    setTotal(tempTotal);
    setVat(tempVat);
    setGrandTotal(tempGrand);
  }, [applyVat]);

  const handleCompletePurchase = () => {
    clearCart();
    setItems([]);
    setTotal(0);
    setVat(0);
    setGrandTotal(0);
    setDate(new Date().toLocaleString('vi-VN'));
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Hóa Đơn</Text>
      <Text style={globalStyles.totalText}>Ngày giờ: {date}</Text>
      {items.map((item) => (
        <Text key={item.id} style={{ fontSize: 16, marginVertical: 5 }}>
          {item.name} x {item.quantity}: {(item.price * item.quantity).toLocaleString('vi-VN')}
        </Text>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Text style={{ fontSize: 16 }}>Áp dụng VAT (10%):</Text>
        <Switch value={applyVat} onValueChange={setApplyVat} />
      </View>
      <Text style={globalStyles.totalText}>Tổng tiền: {total.toLocaleString('vi-VN')}</Text>
      <Text style={globalStyles.totalText}>VAT (10%): {vat.toLocaleString('vi-VN')}</Text>
      <Text style={globalStyles.totalText}>Tổng thanh toán: {grandTotal.toLocaleString('vi-VN')}</Text>
      <Button title="Hoàn tất mua hàng" onPress={handleCompletePurchase} color="#007AFF" />
      <Link href="/" style={globalStyles.linkText}>
        Quay lại danh sách sản phẩm
      </Link>
    </View>
  );
}