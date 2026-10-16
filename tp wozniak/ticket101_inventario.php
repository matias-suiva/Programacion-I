<?php
    //1. Declaración del Vector:
    // declarar un array indexado llamado $costos que
    // contenga los 6 precios ordenados exactamaente como en la tabla
    // (20,15,50,12,8,35).
    $costos = [20, 15, 50, 12, 8, 35];

    // 2. recorrido y procesamiento:
    //recorrer la lista ultilizando foreach
    // Se elimina la impresión individual de cada precio para mostrar solo el
    // reporte final solicitado en la página.
    //3. calculos algoritmicos (pensamiento logico):
    // durante el recorrido del vector el programa debe :
    //.acumular el costo de cada componente para obtener el costo
    // total de produccion de la placa.
    //.contar la cantidad total de componentes procesados.
    //evaluar (con if) cual es el componente mas caro y cual mas barato
    $costoTotal = 0;
    $cantidadComponentes = 0;
    $componenteMasCaro = null;
    $componenteMasBarato = null;

    foreach ($costos as $precio) {
        // Acumulando el costo total
        $costoTotal += $precio;

        // Contando la cantidad de componentes
        $cantidadComponentes++;

        // Evaluando el componente más caro

        if (!isset($componenteMasCaro) || $precio > $componenteMasCaro) {
            $componenteMasCaro = $precio;
        }

        // Evaluando el componente más barato
        if (!isset($componenteMasBarato) || $precio < $componenteMasBarato) {
            $componenteMasBarato = $precio;
        }
        /* distinta manera de evalar si es mas caro o mas barato pero hay que setear las variables en 0 primero
        // Evaluando el componente más caro
        if ($precio > $componenteMasCaro) {
            $componenteMasCaro = $precio;
        }

        // Evaluando el componente más barato
        if ($precio < $componenteMasBarato || $componenteMasBarato === 0) {
            $componenteMasBarato = $precio;
        }
            */

    }
    //4. estadistica:
    // fuera del bucle calcular el costo promedio por componente
    // (costo total / cantidad de componentes)
    $costoPromedio = $costoTotal / $cantidadComponentes;

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de costos</title>
    <style>
        body {
            margin: 0;
            background: #000;
        }

        pre {
            box-sizing: border-box;
            width: 100%;
            min-height: 100vh;
            margin: 0;
            padding: 32px;
            background: #000;
            color: #36ff03;
            font-family: monospace;
            line-height: 1.8;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
<pre>
====================================================
REPORTE DE COSTOS - GARAGE DE APPLE (LOS ALTOS 1976)
====================================================
Costo Total de la Placa Apple I: $<?= $costoTotal ?> USD
Cantidad de Componentes analizados: <?= $cantidadComponentes ?> unidades
Costo Promedio por Componente: $<?= number_format($costoPromedio, 2) ?> USD
Componente Mas Caro: $<?= $componenteMasCaro ?> USD
Componente Mas Barato: $<?= $componenteMasBarato ?> USD
====================================================</pre>
</body>
</html>