<?php
    // 1) DATOS INICIALES
    // Primero deberás crear las variables necesarias para representar lainformación del usuario y del estacionamiento.
    // nombre
    $nombre = "Juan Perez";
    // patente
    $patente = "ABC123";
    // saldo disponible
    $saldo = 2500;
    // numero de box
    $box = 5;
    // el estado del estacionamiento
    $estado = "abierto"; // puede ser "abierto" o "cerrado"
    // un contador de pedidos
    $contadorPedidos = 0;


    // 2) VALIDACION DEL BOX
    //el sistema solo acepta boxes comprendidos entre 1000 y 1999
    if ($box >= 1000 && $box <= 1999) {
        // si es valido, informar
        print("El box $box es válido para el estacionamiento.<br>");
    } else {
        // si no es valido, informar
        print("El box $box no es válido para el estacionamiento.<br>");
    }


    // 3) INICIAR ESTACIONAMIENTO
    //el sistema debe comprobar si se puede iniciar el estacionamiento para eso se debe cumplir con las siguientes condiciones:
    // el box debe ser valido
    // el usuario debe tener al menos 500 de saldo
    // no debe excistir otro estacionamiento activo
    // si se cumple las condiciones el estacionamiento debe quedar en activo
    if ($box >= 1000 && $box <= 1999 && $saldo >= 500 && $estado == "abierto") {
        // si se cumple las condiciones, iniciar el estacionamiento
        print("El estacionamiento ha sido iniciado correctamente.<br>");
        // cambiar el estado del estacionamiento a cerrado
        $estado = "cerrado";
    } else {
        // si no se cumple alguna de las condiciones, informar
        print("No se puede iniciar el estacionamiento. Verifique las condiciones.<br>");
    }


    // 4) SIMULAR PERIODOS
    // Si el estacionamiento está activo, deberás simular el paso de los períodos.
    // cada periodo cuesta 500 en cada repeticion deberas descontar 500 del saldo.
    // aumentar en 1 la cantidad de periodos
    // mostrar el numero del periodo y el saldo restante
    // esto debe continuar mientras exista saldo suficiente para pagar el suiguiente periodo.
    while ($estado == "cerrado" && $saldo >= 500) {
        // descontar 500 del saldo
        $saldo -= 500;
        // aumentar en 1 la cantidad de periodos
        $contadorPedidos++;
        // mostrar el numero del periodo y el saldo restante
        print("Periodo: $contadorPedidos, Saldo restante: $saldo<br>");
    }
    // si nos quedamos sin saldo, informar que el estacionamiento se ha cerrado por falta de fondos
    if ($saldo < 500) {
        print("El estacionamiento se ha cerrado por falta de fondos.<br>");
        // cambiar el estado del estacionamiento a abierto
        $estado = "abierto";
    }


    // 5) FINALIZAR ESTACIONAMIENTO
    // una vez finalizado la simulacion, el estacionamiento debera quedar inactivo
    // debe informar que el estacionamiento ha finalizado, el box utilizado y la cantidad de periodos que se han utilizado.
    print("El estacionamiento ha finalizado.<br>");
    print("Box utilizado: $box<br>");
    print("Cantidad de periodos utilizados: $contadorPedidos<br>");


    // 6) CONSULTAR SALDO
    // el prgrograma debe mostrar el saldo disponible despues de las operaciones realizadas.
    print("Saldo disponible: $saldo<br>");


    // 7) CARGAR SALDO
    // creamos variable que represente una carga de saldo, en este caso 1000
    $cargaSaldo = 1000;
    // la carga solo es valida si es mayor a 0
    if ($cargaSaldo > 0) {
        // si es valida, sumar la carga al saldo disponible
        $saldo += $cargaSaldo;
        // informar que la carga se ha realizado correctamente
        print("La carga de saldo se ha realizado correctamente.<br>"); // y mostrar el monto cargado y el nuevo saldo
        print("Monto cargado: $cargaSaldo<br>");
        print("Nuevo saldo: $saldo<br>"); print("");
    } else {
        // si no es valida, informar que la carga no se ha realizado
        print("La carga de saldo no se ha realizado. Verifique el monto ingresado.<br>");
    }

    // 8) MENU CON SWITCH CASE
    // el programa debe mostrar un menu con las siguientes opciones:
    // 1) INICIAR ESTACIONAMIENTO
    // 2) FINALIZAR ESTACIONAMIENTO
    // 3) CONSULTAR SALDO
    // 4) CARGAR SALDO
    // 5) SALIR
    $opcion = intval(trim(fgets(STDIN))); // variable que representa la opcion seleccionada por el usuario

    switch ($opcion) {
        case 1:
            // INICIAR ESTACIONAMIENTO
            if ($box >= 1000 && $box <= 1999 && $saldo >= 500 && $estado == "abierto") {
                print("El estacionamiento ha sido iniciado correctamente.<br>");
                $estado = "cerrado";
            } else {
                print("No se puede iniciar el estacionamiento. Verifique las condiciones.<br>");
            }
            break;
        case 2:
            // FINALIZAR ESTACIONAMIENTO
            if ($estado == "cerrado") {
                print("El estacionamiento ha finalizado.<br>");
                print("Box utilizado: $box<br>");
                print("Cantidad de periodos utilizados: $contadorPedidos<br>");
                $estado = "abierto";
            } else {
                print("No hay un estacionamiento activo para finalizar.<br>");
            }
            break;
        case 3:
            // CONSULTAR SALDO
            print("Saldo disponible: $saldo<br>");
            break;
        case 4:
            // CARGAR SALDO
            if ($cargaSaldo > 0) {
                $saldo += $cargaSaldo;
                print("La carga de saldo se ha realizado correctamente.<br>");
                print("Monto cargado: $cargaSaldo<br>");
                print("Nuevo saldo: $saldo<br>");
            } else {
                print("La carga de saldo no se ha realizado. Verifique el monto ingresado.<br>");
            }
            break;
        case 5:
            // SALIR
            print("Saliendo del sistema...<br>");
            break;
        default:
            print("Opción no válida. Por favor, seleccione una opción del menú.<br>");
    }

    // 9) PROCESAR 10 VEICULOS
    // el programa deve mostrar procesando vehiculo 1, procesando vehiculo 2, hasta procesando vehiculo 10
    for ($i = 1; $i <= 10; $i++) {
        print("Procesando vehículo $i<br>");
    }