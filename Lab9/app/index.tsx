import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import ProductItem from '../components/ProductItem';
import { globalStyles } from '../components/style';
import { Product, addToCart, getProducts, getStock, initDB, resetDB } from '../db/db';

export default function ProductsScreen() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    initDB();
    loadProducts();
  }, []);

  const loadProducts = () => {
    const prods = getProducts();
    setProducts(prods);
  };

  const handleAddToCart = (id: number) => {
    const stock = getStock(id);
    if (stock <= 0) {
      Alert.alert('Lỗi', 'Sản phẩm hết hàng!');
      return;
    }

    addToCart(id);
    loadProducts();
    Alert.alert('Thành công', 'Đã thêm vào giỏ!');
  };

  const handleResetDB = () => {
    Alert.alert('Xác nhận', 'Bạn muốn reset dữ liệu?', [
      { text: 'Hủy' },
      {
        text: 'OK',
        onPress: () => {
          resetDB();
          loadProducts();
          Alert.alert('Thành công', 'Đã reset dữ liệu!');
        },
      },
    ]);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Danh Sách Sản Phẩm</Text>
      <Button title="Reset Dữ Liệu" onPress={handleResetDB} color="#FF3B30" />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onAddToCart={handleAddToCart} />
        )}
      />
      <Link href="/cart" style={globalStyles.linkText}>
        Xem giỏ hàng
      </Link>
    </View>
  );
}