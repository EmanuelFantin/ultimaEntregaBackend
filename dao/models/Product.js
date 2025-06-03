import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model('Product', productSchema);
