@echo off
echo Starting setup...
cd /d "c:\Users\abbas\Downloads\ai faiure forensic tool"
echo Current directory: %cd%
echo.
echo Installing dependencies...
call npm.cmd install --no-audit --no-fund
echo.
echo Dependencies installed!
echo.
echo Running typecheck...
call npm.cmd run typecheck
echo.
echo Typecheck complete!
echo.
echo Running build...
call npm.cmd run build
echo.
echo Build complete!
pause
