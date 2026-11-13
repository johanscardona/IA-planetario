@echo off
title ASTRONOMIA 3D - SERVIDOR ESPACIAL
color 0b
echo ======================================================================
echo    ASTRONOMIA 3D // PLATAFORMA DE EXPLORACION ESPACIAL CON IA
echo ======================================================================
echo.
echo Iniciando servidor en http://localhost:5000 ...
echo Abriendo tu navegador predeterminado...
echo.

start "" "http://localhost:5000"
node server.js

pause
