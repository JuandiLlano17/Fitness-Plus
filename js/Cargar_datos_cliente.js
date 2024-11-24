// Obtener el id del cliente desde la URL
const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get('id');  // Obtenemos el id del cliente desde la URL

// Verificar si se ha proporcionado el ID del cliente
if (!clienteId) {
    console.error("No se ha proporcionado el ID del cliente.");
} else {
    console.log("ID Cliente:", clienteId);
}

// Hacer que el clienteId sea accesible globalmente
window.clienteId = clienteId;  // Guardamos el clienteId en el objeto global `window`