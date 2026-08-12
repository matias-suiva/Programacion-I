<?php
    echo "Ingrese la cantidad de bolas negras de la urna A: ";
    $negrasA = intval(trim(fgets(STDIN)));

    echo "Ingrese la cantidad de bolas blancas de la urna A: ";
    $blancasA = intval(trim(fgets(STDIN)));

    echo "Ingrese la cantidad de bolas negras de la urna B: ";
    $negrasB = intval(trim(fgets(STDIN)));

    echo "Ingrese la cantidad de bolas blancas de la urna B: ";
    $blancasB = intval(trim(fgets(STDIN)));

    $totalA = $negrasA + $blancasA;
    $totalB = $negrasB + $blancasB;

    $probNegraA = $negrasA / $totalA;    // Probabilidad de sacar una bola negra de la urna A
    $probBlancaA = $blancasA / $totalA;  // Probabilidad de sacar una bola blanca de la urna A

    $probNegraB = $negrasB / $totalB;  // Probabilidad de sacar una bola negra de la urna B
    $probBlancaB = $blancasB / $totalB;  // Probabilidad de sacar una bola blanca de la urna B

    $probMismoColor = ($probNegraA * $probNegraB) + ($probBlancaA * $probBlancaB); // Probabilidad de sacar bolas del mismo color de ambas urnas
    $probDistintoColor = ($probNegraA * $probBlancaB) + ($probBlancaA * $probNegraB); // Probabilidad de sacar bolas de distinto color de ambas urnas
    // probabilidad de sacar bola negra de la urna A
    $probnegraA = $negrasA / $totalA;
    // probabilidad de sacar bola blanca de la urna A  
    $probBlancaA = $blancasA / $totalA;
    // probabilidad de sacar bola negra de la urna B
    $probnegraB = $negrasB / $totalB;
    //probabilidad de sacar bola blanca de la urna B
    $probBlancaB = $blancasB / $totalB;

    while (true) {

    echo "\n1. Probabilidad de mismo color\n";
    echo "2. Probabilidad de distinto color\n";
    echo "3. Probabilidad de sacar bola negra de la urna A\n";
    echo "4. Probabilidad de sacar bola blanca de la urna A\n";
    echo "5. Probabilidad de sacar bola negra de la urna B\n";
    echo "6. Probabilidad de sacar bola blanca de la urna B\n";
    echo "7. Salir\n";

    echo "Seleccione una opción: ";
    $opcion = intval(trim(fgets(STDIN)));

    // Acá vamos a decidir qué hacer según la opción
    switch ($opcion) {

    case 1:
        echo "La probabilidad de sacar el mismo color es: " . ($probMismoColor * 100) . "%\n";
        break;

    case 2:
        echo "La probabilidad de sacar distinto color es: " . ($probDistintoColor * 100) . "%\n";
        break;

    case 3:
        echo "La probabilidad de sacar bola negra de la urna A es: " . ($probnegraA * 100) . "%\n";
        break;

    case 4:
        echo "La probabilidad de sacar bola blanca de la urna A es: " . ($probBlancaA * 100) . "%\n";
        break;

    case 5:
        echo "La probabilidad de sacar bola negra de la urna B es: " . ($probnegraB * 100) . "%\n";
        break;

    case 6:
        echo "La probabilidad de sacar bola blanca de la urna B es: " . ($probBlancaB * 100) . "%\n";
        break;

    case 7:
        echo "Programa finalizado.\n";
        exit;

    default:
        echo "Opción inválida.\n";
        }   
    }
?>
