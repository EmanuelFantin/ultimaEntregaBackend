import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

export default (io) => {
  router.get('/', async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });

    result.status = 'success';
    result.prevLink = result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null;
    result.nextLink = result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null;

    res.json(result);
  });

  router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.json(product);
  });

  router.post('/', async (req, res) => {
    const nuevoProducto = await productManager.addProduct(req.body);
    io.emit('productosActualizados', await productManager.getProducts({}));
    res.status(201).json(nuevoProducto);
  });

  router.put('/:pid', async (req, res) => {
    const actualizado = await productManager.updateProduct(req.params.pid, req.body);
    if (!actualizado) return res.status(404).send('Producto no encontrado');
    res.json(actualizado);
  });

  router.delete('/:pid', async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    io.emit('productosActualizados', await productManager.getProducts({}));
    res.status(204).send();
  });

  return router;
};
