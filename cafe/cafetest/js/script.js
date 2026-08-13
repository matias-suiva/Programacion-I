// Script de interacción con productos y botón de información
// Función para mostrar un mensaje de bienvenida al hacer clic en el botón de información
function mostrarInfoStarbucks() {
    // Obtener el botón por su id y mostrar un mensaje de bienvenida
    const boton = document.getElementById("btnInfo");
    if (boton) {
        alert("Bienvenido a Starbucks Argentina. Disfrutá de nuestras bebidas especiales y el mejor ambiente para tu café.");
    }
}
 // Función para mostrar detalles del producto al hacer clic en él//
function mostrarDetalleProducto(evento) {
    const articulo = evento.currentTarget;
    if (!articulo) {
        return;
    }
 // Obtener el nombre y la descripción del producto desde el artículo clickeado //
    const nombre = articulo.querySelector("h3")?.textContent;
    const descripcion = articulo.querySelector("p")?.textContent;
 // Mostrar un mensaje con el nombre y la descripción del producto //
    alert(`Producto: ${nombre}\nDescripción: ${descripcion}`);

}

// Asociar clics del botón y de los productos cuando cargue la página
document.addEventListener("DOMContentLoaded", function () {
    const btnInfo = document.getElementById("btnInfo");
    if (btnInfo) {
        btnInfo.onclick = mostrarInfoStarbucks;
    }

    const productos = [
        document.getElementById("producto1"),
        document.getElementById("producto2"),
        document.getElementById("producto3")
    ];
// Asociar el evento de clic a cada producto y no estyar haciendo un .onclick por cada imagen pasa por un forEach para recorrer el array de productos y asignar el evento de clic a cada uno de ellos. //

    productos.forEach(function (producto) {
        if (producto) {
            producto.onclick = mostrarDetalleProducto;
        }
    });
});
