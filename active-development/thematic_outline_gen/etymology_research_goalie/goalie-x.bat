@echo off
REM GOALIE-X Launcher for Windows
REM Complete replacement for GOALIE's query generation

setlocal enabledelayedexpansion

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org
    exit /b 1
)

REM Set script directory
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM Check for first argument
if "%1"=="" (
    goto :menu
)

REM Handle command line arguments
if "%1"=="install" goto :install
if "%1"=="search" goto :search
if "%1"=="direct" goto :direct
if "%1"=="analyze" goto :analyze
if "%1"=="etymology" goto :etymology
if "%1"=="cultural" goto :cultural
if "%1"=="full" goto :full
goto :menu

:install
echo Installing GOALIE-X...
call npm install
echo.
echo Creating .env file...
set /p API_KEY="Enter your Perplexity API key: "
echo PERPLEXITY_API_KEY=%API_KEY% > .env
echo.
echo Installation complete!
goto :end

:search
if "%2"=="" (
    echo Error: Query required for search
    exit /b 1
)
echo Running intelligent search...
node goalie-x.mjs search %2 %3 %4 %5 %6 %7 %8 %9
goto :end

:direct
if "%2"=="" (
    echo Error: Queries required for direct search
    exit /b 1
)
echo Running direct search...
shift
set QUERIES=%1
:direct_loop
shift
if not "%1"=="" (
    set QUERIES=%QUERIES% %1
    goto :direct_loop
)
node goalie-x.mjs direct %QUERIES%
goto :end

:analyze
if "%2"=="" (
    echo Error: Query required for analysis
    exit /b 1
)
echo Analyzing query...
node goalie-x.mjs analyze %2 %3 %4 %5 %6 %7 %8 %9
goto :end

:etymology
echo Running Etymology Research Suite...
echo.
node goalie-x.mjs direct ^
    "autodidact didaktikos Greek didaskein teaching autos self etymology" ^
    "autodidactus Latin medieval scholarly tradition etymology" ^
    "autodidact Proto-Indo-European dek receive linguistic roots" ^
    "self-taught multilingual etymology comparative linguistics" ^
    --model sonar-pro --mode academic
goto :end

:cultural
echo Running Cultural History Research Suite...
echo.
node goalie-x.mjs direct ^
    "autodidactic ancient Greek paideia Roman education cultural history" ^
    "autodidactic medieval monasteries Islamic madrasah Jewish yeshiva" ^
    "autodidactic Renaissance humanism Enlightenment Bildung" ^
    "autodidactic Confucian self-cultivation Buddhist traditions" ^
    --model sonar-pro --mode academic
goto :end

:full
echo Running Full Autodidactic Research Suite...
echo.
node goalie-x.mjs search "etymology and cultural history of autodidactic learning" ^
    --model sonar-pro --mode academic --output .research
goto :end

:menu
cls
echo ========================================
echo   GOALIE-X: Enhanced Research Assistant
echo   Complete GOALIE Replacement (rUv-style)
echo ========================================
echo.
echo Choose an option:
echo.
echo 1. Install/Setup
echo 2. Search (Intelligent multi-query)
echo 3. Direct (Your exact queries)
echo 4. Analyze (Show generated queries)
echo 5. Etymology Research Suite
echo 6. Cultural History Suite
echo 7. Full Research (Complete)
echo 8. Exit
echo.
set /p CHOICE="Enter choice (1-8): "

if "%CHOICE%"=="1" (
    call :install
    pause
    goto :menu
)

if "%CHOICE%"=="2" (
    set /p QUERY="Enter your research query: "
    node goalie-x.mjs search "!QUERY!" --model sonar-pro --mode academic
    pause
    goto :menu
)

if "%CHOICE%"=="3" (
    echo Enter queries separated by semicolons:
    set /p QUERIES="Queries: "
    REM Parse semicolon-separated queries
    set QUERY_LIST=
    for %%a in ("!QUERIES:;=" "!") do (
        set QUERY_LIST=!QUERY_LIST! %%a
    )
    node goalie-x.mjs direct !QUERY_LIST! --model sonar-pro --mode academic
    pause
    goto :menu
)

if "%CHOICE%"=="4" (
    set /p QUERY="Enter query to analyze: "
    node goalie-x.mjs analyze "!QUERY!"
    pause
    goto :menu
)

if "%CHOICE%"=="5" (
    call :etymology
    pause
    goto :menu
)

if "%CHOICE%"=="6" (
    call :cultural
    pause
    goto :menu
)

if "%CHOICE%"=="7" (
    call :full
    pause
    goto :menu
)

if "%CHOICE%"=="8" (
    goto :end
)

echo Invalid choice
pause
goto :menu

:end
endlocal
