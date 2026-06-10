/*
=============================================
LABORATORIO DE NIKOLA TESLA
PRIMERA CLASE DE JAVASCRIPT
=============================================
FUNCION encenderBombilla()
==============================================
- Al hacer click en el botón "Encender Bombilla", la imagen de la bombilla se debe cambiar a una bombilla encendida.
- Al hacer click en el botón nuevamente la imagen de la bombilla se debe cambiar a una bombilla apagada.
==============================================
*/
function toggleBombilla() {
    const bombilla = document.getElementById("bombilla");

    if (bombilla.classList.contains("encendida")) {
        bombilla.classList.remove("encendida");
        bombilla.classList.add("apagada");
    } else {
        bombilla.classList.remove("apagada");
        bombilla.classList.add("encendida");
    }
}