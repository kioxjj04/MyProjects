import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('shopping.db');

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export const initDB = () => {
  db.withTransactionSync(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS Cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL
      );
    `);

    const count = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM Products;')?.count || 0;
    if (count === 0) {
      db.execSync(`
        INSERT INTO Products (name, price, stock) VALUES ('Áo Thun', 200000, 20);
        INSERT INTO Products (name, price, stock) VALUES ('Quần Jeans', 500000, 15);
        INSERT INTO Products (name, price, stock) VALUES ('Giày Sneaker', 800000, 10);
        INSERT INTO Products (name, price, stock) VALUES ('Mũ Nón', 100000, 30);
        INSERT INTO Products (name, price, stock) VALUES ('Túi Xách', 300000, 25);
      `);
    }
  });
};

export const getProducts = (): Product[] => {
  return db.getAllSync<Product>('SELECT * FROM Products;');
};

export const getCartItems = (): CartItem[] => {
  return db.getAllSync<CartItem>(`
    SELECT c.id, c.product_id, p.name, p.price, c.quantity
    FROM Cart c
    JOIN Products p ON c.product_id = p.id;
  `);
};

export const addToCart = (productId: number) => {
  db.withTransactionSync(() => {
    const existing = db.getFirstSync<{ id: number; quantity: number }>(
      'SELECT id, quantity FROM Cart WHERE product_id = ?;',
      [productId]
    );

    if (existing) {
      db.runSync('UPDATE Cart SET quantity = ? WHERE id = ?;', [existing.quantity + 1, existing.id]);
    } else {
      db.runSync('INSERT INTO Cart (product_id, quantity) VALUES (?, 1);', [productId]);
    }

    updateStock(productId, -1);
  });
};

export const updateQuantity = (cartId: number, newQuantity: number) => {
  db.withTransactionSync(() => {
    const item = db.getFirstSync<{ product_id: number; quantity: number }>(
      'SELECT product_id, quantity FROM Cart WHERE id = ?;',
      [cartId]
    );

    if (!item) return;

    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    const delta = newQuantity - item.quantity;
    db.runSync('UPDATE Cart SET quantity = ? WHERE id = ?;', [newQuantity, cartId]);
    updateStock(item.product_id, -delta);
  });
};

export const removeFromCart = (cartId: number) => {
  db.withTransactionSync(() => {
    const item = db.getFirstSync<{ product_id: number; quantity: number }>(
      'SELECT product_id, quantity FROM Cart WHERE id = ?;',
      [cartId]
    );

    if (!item) return;

    db.runSync('DELETE FROM Cart WHERE id = ?;', [cartId]);
    updateStock(item.product_id, item.quantity);
  });
};

export const updateStock = (productId: number, delta: number) => {
  db.runSync('UPDATE Products SET stock = stock + ? WHERE id = ?;', [delta, productId]);
};

export const getStock = (productId: number): number => {
  return db.getFirstSync<{ stock: number }>('SELECT stock FROM Products WHERE id = ?;', [productId])?.stock || 0;
};

// New: Clear cart after purchase
export const clearCart = () => {
  db.withTransactionSync(() => {
    const items = getCartItems();
    items.forEach((item) => {
      updateStock(item.product_id, item.quantity);
    });
    db.runSync('DELETE FROM Cart;');
  });
};

// New: Reset database for testing
export const resetDB = () => {
  db.withTransactionSync(() => {
    db.execSync(`
      DROP TABLE IF EXISTS Cart;
      DROP TABLE IF EXISTS Products;
    `);
    initDB(); // Reinitialize with sample data
  });
};