import { Product } from '../dao/models/Product.js';
import mongoose from 'mongoose';

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const filter = query ? { $or: [
      { category: query },
      { available: query === 'true' }
    ] } : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
      lean: true
    };

    const result = await Product.paginate(filter, options);
    return result;
  }

  async getProductById(id) {
    // Validar si el id es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }

  async addProduct(product) {
    return await Product.create(product);
  }

  async updateProduct(id, updates) {
    // Validar si el id es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, lean: true });
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }

  async deleteProduct(id) {
    // Validar si el id es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const product = await Product.findByIdAndDelete(id, { lean: true });
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }
}