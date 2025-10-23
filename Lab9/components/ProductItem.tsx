import { Button, StyleSheet, Text, View } from 'react-native';
import { Product } from '../db/db';

interface ProductItemProps {
  product: Product;
  onAddToCart: (id: number) => void;
}

export default function ProductItem({ product, onAddToCart }: ProductItemProps) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {product.name} - Giá: {product.price.toLocaleString('vi-VN')} - Tồn: {product.stock}
      </Text>
      <Button
        title="Thêm vào giỏ"
        onPress={() => onAddToCart(product.id)}
        disabled={product.stock <= 0}
        color="#007AFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
});