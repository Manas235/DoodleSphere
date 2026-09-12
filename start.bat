@echo off
title DoodleSphere - Animus Memory Void Server
echo ========================================================
echo        DOODLESPHERE - ANIMUS MEMORY VOID
echo ========================================================
echo Starting local node server at http://localhost:3000 ...
echo.

:: Open default browser to localhost:3000 after 1 second delay
start "" http://localhost:3000

:: Start the Node server
node server.js

pause
