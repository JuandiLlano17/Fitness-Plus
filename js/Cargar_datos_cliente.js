// Obtener el id del cliente desde la URL
const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get('id');  // Obtenemos el id del cliente desde la URL
const dias= urlParams.get('dias');

// Verificar si se ha proporcionado el ID del cliente
if (!clienteId) {
    console.error("No se ha proporcionado el ID del cliente.");
} else {
    console.log("ID Cliente:", clienteId);
}

// Verificar si se ha proporcionado los dias
if (!dias) {
    console.error("No se ha proporcionado dias de entreno.");
} else {
    console.log("Dias:", dias);
}

// Hacer que el clienteId sea accesible globalmente
window.clienteId = clienteId;  // Guardamos el clienteId en el objeto global `window`
window.dias = dias;