<?php
// guardamos un numero en una variable
$numero = intval.(trim(fgets(STDIN)));
// si la variable es mayor o igual a 100, mostrar "La bobina está encendida a toda potencia", sino "La bobina está en modo bajo consumo".
if ($numero >= 100) {
    echo "La bobina está encendida a toda potencia\n";
} else {
    echo "La bobina está en modo bajo consumo\n";
}