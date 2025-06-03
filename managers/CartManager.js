import { Cart } from '../dao/models/Cart.js';
import mongoose from 'mongoose';

export default class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async getCartById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de carrito inválido');
    }

    const cart = await Cart.findById(id).populate('products.product').lean();
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    return cart;
  }

  async addProductToCart(cartId, productId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('ID de carrito inválido');
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('ID de producto inválido');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const prodIndex = cart.products.findIndex(p => p.product.equals(productId));

    if (prodIndex !== -1) {
      cart.products[prodIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart.toObject();
  }

  async removeProductFromCart(cartId, productId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('ID de carrito inválido');
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('ID de producto inválido');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(p => !p.product.equals(productId));
    if (cart.products.length === initialLength) {
      throw new Error('Producto no encontrado en el carrito');
    }

    await cart.save();
    return cart.toObject();
  }

  async updateCart(cartId, productsArray) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('ID de carrito inválido');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Validar que productsArray contenga ObjectIds válidos
    if (productsArray) {
      for (const item of productsArray) {
        if (!mongoose.Types.ObjectId.isValid(item.product)) {
          throw new Error('ID de producto inválido en la lista');
        }
      }
    }

    cart.products = productsArray || [];
    await cart.save();
    return cart.toObject();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('ID de carrito inválido');
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('ID de producto inválido');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('La cantidad debe ser un número entero positivo');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const prod = cart.products.find(p => p.product.equals(productId));
    if (!prod) {
      throw new Error('Producto no encontrado en el carrito');
    }

    prod.quantity = quantity;
    await cart.save();
    return cart.toObject();
  }

  async clearCart(cartId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('ID de carrito inválido');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = [];
    await cart.save();
    return cart.toObject();
  }
}