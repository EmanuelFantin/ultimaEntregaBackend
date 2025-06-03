import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket
import ProductManager from './managers/ProductManager.js';
const productManager = new ProductManager();

io.on('connection', socket => {
  console.log('Cliente conectado por Socket.io');

  socket.on('nuevoProducto', async (data) => {
    await productManager.addProduct(data);
    const result = await productManager.getProducts({});
    io.emit('productosActualizados', result);
  });

  socket.on('eliminarProducto', async (id) => {
    await productManager.deleteProduct(id);
    const result = await productManager.getProducts({});
    io.emit('productosActualizados', result);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
