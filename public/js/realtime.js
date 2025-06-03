const socket = io();

const form = document.getElementById('productForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  socket.emit('nuevoProducto', data);
});

const deleteForm = document.getElementById('deleteForm');
deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const { id } = Object.fromEntries(new FormData(deleteForm));
  socket.emit('eliminarProducto', id);
});

socket.on('productosActualizados', async () => {
  const res = await fetch('/api/products');
  const { docs } = await res.json();
  const ul = document.getElementById('productList');
  ul.innerHTML = docs.map(p => `<li>${p.title} - $${p.price}</li>`).join('');
});
