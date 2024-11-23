// productManager.js
const { db, auth } = require('./firebaseAdmin');

// Función para iniciar sesión
async function iniciarSesion(email, password) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    // Aquí solo estamos obteniendo el usuario por correo,
    // ya que la autenticación en el backend típicamente se maneja diferente
    console.log("Sesión iniciada:", userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    throw new Error("Error en inicio de sesión");
  }
}

// Función para agregar producto
async function agregarProducto(precio, cantidad, descripcion) {
  try {
    const docRef = await db.collection("productos").add({
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
      descripcion: descripcion
    });
    console.log("Producto agregado con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar producto:", error);
    throw new Error("Error al agregar producto");
  }
}

// Función para obtener productos
async function obtenerProductos() {
  try {
    const snapshot = await db.collection("productos").get();
    const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Productos obtenidos:", productos);
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("Error al obtener productos");
  }
}

// Función para eliminar producto
async function eliminarProducto(id) {
  try {
    await db.collection("productos").doc(id).delete();
    console.log("Producto eliminado con ID:", id);
    return id;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw new Error("Error al eliminar producto");
  }
}

module.exports = {
  iniciarSesion,
  agregarProducto,
  obtenerProductos,
  eliminarProducto
};
