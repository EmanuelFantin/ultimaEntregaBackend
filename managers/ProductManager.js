import { Product } from '../dao/models/Product.js';

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
    return await Product.findById(id).lean();
  }

  async addProduct(product) {
    return await Product.create(product);
  }

  async updateProduct(id, updates) {
    return await Product.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}
