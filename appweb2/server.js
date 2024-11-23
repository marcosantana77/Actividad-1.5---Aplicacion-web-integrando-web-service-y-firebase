const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const productManager = require('./productManager');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Configuración de sesiones
app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Ruta de inicio de sesión (renderiza login.html)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Ruta de productos (renderiza productos.html)
app.get('/productos.html', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'productos.html'));
  } else {
    res.redirect('/login.html');
  }
});

// Ruta para la raíz, redirige al inicio de sesión
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Ruta de autenticación de inicio de sesión
app.post('/iniciarSesion', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await productManager.iniciarSesion(email, password);
    req.session.user = user; // Guarda el usuario en la sesión
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Ruta de cierre de sesión
app.post('/cerrarSesion', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: 'Error al cerrar sesión' });
    }
    res.status(200).send();
  });
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login.html');
}

// Rutas para gestionar productos (requieren autenticación)
app.post('/agregarProducto', isAuthenticated, async (req, res) => {
  const { precio, cantidad, descripcion } = req.body;
  try {
    const productId = await productManager.agregarProducto(precio, cantidad, descripcion);
    res.status(200).send({ id: productId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/obtenerProductos', isAuthenticated, async (req, res) => {
  try {
    const productos = await productManager.obtenerProductos();
    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/eliminarProducto/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedId = await productManager.eliminarProducto(id);
    res.status(200).send({ id: deletedId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.put('/editarProducto/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { precio, cantidad, descripcion } = req.body;
  try {
    await db.collection("productos").doc(id).update({
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
      descripcion
    });
    res.status(200).send({ message: "Producto editado con éxito" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
