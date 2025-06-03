import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
  const result = await productManager.getProducts({ page: 1, limit: 10 });
  res.render('home', { products: result.docs });
});

router.get('/realtimeproducts', async (req, res) => {
  const result = await productManager.getProducts({ page: 1, limit: 50 });
  res.render('realTimeProducts', { products: result.docs });
});

router.get('/products', async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const result = await productManager.getProducts({ limit, page, sort, query });

  res.render('home', {
    products: result.docs,
    pagination: {
      page: result.page,
      totalPages: result.totalPages,
      hasPrev: result.hasPrevPage,
      hasNext: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    }
  });
});

router.get('/products/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).send('Producto no encontrado');
  res.render('productDetails', { product });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).send('Carrito no encontrado');
  res.render('cartDetails', { cart });
});

export default router;
