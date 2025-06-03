import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

export default (io) => {
  router.post('/', async (req, res) => {
    try {
      const cart = await cartManager.createCart();
      io?.emit('cartsActualizados', await cartManager.getCarts?.() || {});
      res.status(201).json({ status: 'success', data: cart });
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: 'error', error: 'Error al crear el carrito' });
    }
  });

  router.get('/:cid', async (req, res) => {
    try {
      const cart = await cartManager.getCartById(req.params.cid);
      res.json({ status: 'success', data: cart });
    } catch (error) {
      if (error.message === 'ID de carrito inválido') {
        return res.status(400).json({ status: 'error', error: 'ID de carrito inválido' });
      }
      if (error.message === 'Carrito no encontrado') {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  });

  router.post('/:cid/products/:pid', async (req, res) => {
    try {
      const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
      io?.emit('cartsActualizados', await cartManager.getCarts?.() || {});
      res.json({ status: 'success', data: cart });
    } catch (error) {
      if (error.message === 'ID de carrito inválido' || error.message === 'ID de producto inválido') {
        return res.status(400).json({ status: 'error', error: error.message });
      }
      if (error.message === 'Carrito no encontrado') {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  });

  router.delete('/:cid/products/:pid', async (req, res) => {
    try {
      const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
      io?.emit('cartsActualizados', await cartManager.getCarts?.() || {});
      res.json({ status: 'success', data: cart });
    } catch (error) {
      if (error.message === 'ID de carrito inválido' || error.message === 'ID de producto inválido') {
        return res.status(400).json({ status: 'error', error: error.message });
      }
      if (error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito') {
        return res.status(404).json({ status: 'error', error: error.message });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  });

  router.put('/:cid', async (req, res) => {
    try {
      const cart = await cartManager.updateCart(req.params.cid, req.body.products);
      io?.emit('cartsActualizados', await cartManager.getCarts?.() || {});
      res.json({ status: 'success', data: cart });
    } catch (error) {
      if (error.message === 'ID de carrito inválido' || error.message === 'ID de producto inválido en la lista') {
        return res.status(400).json({ status: 'error', error: error.message });
      }
      if (error.message === 'Carrito no encontrado') {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  });

  router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { quantity } = req.body;
      const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
      io?.emit('cartsActualizados', await cartManager.getCarts?.() || {});
      res.json({ status: 'success', data: cart });
    } catch (error) {
      if (error.message === 'ID de carrito inválido' || error.message === 'ID de producto inválido' || error.message === 'La cantidad debe ser un número entero positivo') {
        return res.status(400).json({ status: 'error', error: error.message });
      }
      if (error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito') {
        return res.status(404).json({ status: 'error', error: error.message });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  });

  router.delete('/:cid', async (req, res) => {
    try {
      const cart = await cartManager.clearCart(req.params.cid);
      io?.emit('cartsActualizados', await cartManager.getCarts?.() || {});
      res.json({ status: 'success', data: cart });
    } catch (error) {
      if (error.message === 'ID de carrito inválido') {
        return res.status(400).json({ status: 'error', error: 'ID de carrito inválido' });
      }
      if (error.message === 'Carrito no encontrado') {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  });

  return router;
};