@echo off
title Mundial 2026 - Launcher
echo ========================================
echo   Mundial 2026 - Iniciando servidores
echo ========================================
echo.

:: Levantar el backend (Laravel) en una ventana aparte
echo [1/2] Iniciando backend (Laravel) en http://127.0.0.1:8000 ...
start "Backend - Laravel (puerto 8000)" cmd /k "cd /d %~dp0backend-mundial && php artisan serve"

:: Esperar 2 segundos para que el backend arranque primero
timeout /t 2 /nobreak >nul

:: Levantar el frontend en otra ventana aparte
echo [2/2] Iniciando frontend en http://127.0.0.1:5500 ...
start "Frontend - Mundial 2026 (puerto 5500)" cmd /k "cd /d %~dp0 && php -S 127.0.0.1:5500"

:: Esperar 1 segundo y abrir el navegador
timeout /t 1 /nobreak >nul
echo.
echo ========================================
echo   Servidores corriendo:
echo   Frontend: http://127.0.0.1:5500
echo   Backend:  http://127.0.0.1:8000
echo ========================================
echo.
echo Abriendo el navegador...
start http://127.0.0.1:5500
echo.
echo Podes cerrar esta ventana. Los servidores
echo siguen corriendo en sus propias ventanas.
pause
