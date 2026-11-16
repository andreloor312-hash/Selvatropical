import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useProductStore = create((set) => ({
  products: [],
  loading: true,

  subscribeToProducts: () => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      set({ products: items, loading: false });
    });
  },

  addProduct: async (productData) => {
    await addDoc(collection(db, 'products'), {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      createdAt: serverTimestamp(),
    });
  },

  updateProduct: async (id, productData) => {
    const ref = doc(db, 'products', id);
    await updateDoc(ref, {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      updatedAt: serverTimestamp(),
    });
  },

  deleteProduct: async (id) => {
    await deleteDoc(doc(db, 'products', id));
  },

  decrementStockAfterOrder: async (cartItems) => {
    await runTransaction(db, async (transaction) => {
      const snapshots = [];

      // 1. Leer el stock actual de todos los productos del carrito
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.id);
        const snap = await transaction.get(productRef);
        if (!snap.exists()) {
          throw new Error(`El producto "${item.name}" ya no existe.`);
        }
        const currentStock = Number(snap.data().stock || 0);
        if (currentStock < item.qty) {
          throw new Error(
            `Stock insuficiente para "${item.name}". Disponible: ${currentStock} und.`
          );
        }
        snapshots.push({ productRef, newStock: currentStock - item.qty });
      }

      // 2. Aplicar el descuento atómico
      for (const { productRef, newStock } of snapshots) {
        transaction.update(productRef, {
          stock: newStock,
          updatedAt: serverTimestamp(),
        });
      }
    });
  },
}));