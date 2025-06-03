import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

export default (io) => {
  router.get('/', async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query;
      const result = await productManager.getProducts({ limit, page, sort, query });

      result.status = 'success';
      result.prevLink = result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null;
      result.nextLink = result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null;

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
    }
  });

  router.get('/:pid', async (req, res) => {
    try {
      const product = await productManager.getProductById(req.params.pid);
      res.json(product);
    } catch (error) {
      if (error.message === 'ID inválido') {
        return res.status(400).json({ status: 'error', error: 'ID inválido' });
      }
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const nuevoProducto = await productManager.addProduct(req.body);
      io.emit('productosActualizados', await productManager.getProducts({}));
      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: 'error', error: 'Error al crear el producto' });
    }
  });

  router.put('/:pid', async (req, res) => {
    try {
      const actualizado = await productManager.updateProduct(req.params.pid, req.body);
      io.emit('productosActualizados', await productManager.getProducts({}));
      res.json(actualizado);
    } catch (error) {
      if (error.message === 'ID inválido') {
        return res.status(400).json({ status: 'error', error: 'ID inválido' });
      }
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error al actualizar el producto' });
    }
  });

  router.delete('/:pid', async (req, res) => {
    try {
      const eliminado = await productManager.deleteProduct(req.params.pid);
      io.emit('productosActualizados', await productManager.getProducts({}));
      res.status(200).json({ status: 'success', message: 'Producto eliminado', data: eliminado });
    } catch (error) {
      if (error.message === 'ID inválido') {
        return res.status(400).json({ status: 'error', error: 'ID inválido' });
      }
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error al eliminar el producto' });
    }
  });

  return router;
};