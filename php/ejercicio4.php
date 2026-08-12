<?php
// mostramos en pantalla los numeros del 1 al 20, y al lado de cada numero indique si es multiplo de 3, 6 o 9.
for ($i = 1; $i <= 20; $i++) {
    echo "$i ";
    if ($i % 3 == 0) {
        echo "es multiplo de 3 ";
    }
    if ($i % 6 == 0) {
        echo "es multiplo de 6 ";
    }
    if ($i % 9 == 0) {
        echo "es multiplo de 9 ";
    }
    echo "\n";
}