<?php
    // mostramos en pantalla los numeros del 1 al 20, y al lado de cada numero indique si es multiplo de 3, 6 o 9.
    for ($i = 1; $i <= 20; $i++) //$i es la variable que incrementa hasta 20, $i++ lo incrementa en 1 cada vez que se ejecuta el bucle
    {
        echo "$i "; //muestra el numero actual
        if ($i % 3 == 0)  // si el numero es multiplo de 3, 6 o 9, se muestra un mensaje indicando que es multiplo de ese numero
            {
                echo "[es multiplo de 3] ";
            }
        if ($i % 6 == 0) 
            {
                echo "[es multiplo de 6] ";
            }
        if ($i % 9 == 0) 
            {
                echo "[es multiplo de 9] ";
            }
        echo "<br>"; //salto de linea para que el otro numero no nos quede pegado
    }