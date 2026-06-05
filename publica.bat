@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Creative Monkeyz Portal - Publicare
echo ============================================
echo.
echo [1/2] Reconstruiesc catalogul din folderul CM...
call node scripts\build-all.js
echo.
echo [2/2] Urc modificarile pe internet...
git add -A
git commit -m "Actualizare catalog" || echo    (nimic nou de salvat)
git push
echo.
echo ============================================
echo   Gata! Site-ul se actualizeaza in ~1 minut:
echo   https://sorin2net.github.io/CM_Portal/
echo ============================================
echo.
pause
