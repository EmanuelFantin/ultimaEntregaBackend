import { Cart } from '../dao/models/Cart.js';

export default class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product').lean();
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const prodIndex = cart.products.findIndex(p => p.product.equals(productId));

    if (prodIndex !== -1) {
      cart.products[prodIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => !p.product.equals(productId));
    await cart.save();
    return cart;
  }

  async updateCart(cartId, productsArray) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = productsArray;
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const prod = cart.products.find(p => p.product.equals(productId));
    if (!prod) return null;

    prod.quantity = quantity;
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}
