import { Button, StyleSheet, Text, View } from 'react-native';
import { CartItem as CartItemType } from '../db/db';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.name} - Giá: {item.price.toLocaleString('vi-VN')} - SL: {item.quantity}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={() => onUpdateQuantity(item.id, 1)} color="#007AFF" />
        <Button
          title="-"
          onPress={() => onUpdateQuantity(item.id, -1)}
          disabled={item.quantity <= 1}
          color="#007AFF"
        />
        <Button title="Xóa" onPress={() => onRemove(item.id)} color="#FF3B30" />
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});