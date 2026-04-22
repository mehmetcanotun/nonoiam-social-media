@echo off
if not "%1"=="GO" (
    cmd /k "%~f0" GO
    exit /b
)

chcp 437 >nul 2>&1
title nonoiam - Dependency Fix

echo.
echo  ============================================
echo   nonoiam - React Versiyon Duzeltme
echo  ============================================
echo.

set "PDIR=%USERPROFILE%\Projects\nonoiam"

if not exist "%PDIR%\package.json" (
    echo  [HATA] Proje bulunamadi: %PDIR%
    echo  Once nonoiam-setup.bat calistir.
    goto BITTI
)

cd /d "%PDIR%"
echo  [OK] Proje klasoru: %PDIR%
echo.

:: 1. node_modules ve lock dosyasini temizle
echo  [1/5] Eski bagimliliklar temizleniyor...
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json
echo        [OK] Temizlendi.
echo.

:: 2. React versiyonunu guncelle
echo  [2/5] React 19.2.4 versiyonuna guncelleniyor...
call npm install react@19.2.4 react-dom@19.2.4 --save --legacy-peer-deps
echo        [OK] React guncellendi.
echo.

:: 3. Tum paketleri tekrar kur
echo  [3/5] Tum paketler kuruluyor... (1-2 dk)
call npm install --legacy-peer-deps
echo        [OK] Paketler kuruldu.
echo.

:: 4. Expo paketlerini kur
echo  [4/5] Expo paketleri kuruluyor... (2-3 dk)
call npx expo install expo-router expo-font expo-splash-screen --fix --npm-install-flags="--legacy-peer-deps"
call npx expo install react-native-reanimated react-native-gesture-handler --fix --npm-install-flags="--legacy-peer-deps"
call npx expo install react-native-safe-area-context react-native-screens --fix --npm-install-flags="--legacy-peer-deps"
call npx expo install @react-native-async-storage/async-storage --fix --npm-install-flags="--legacy-peer-deps"
call npx expo install expo-localization --fix --npm-install-flags="--legacy-peer-deps"
echo        [OK] Expo paketleri kuruldu.
echo.

:: 5. Supabase kur
echo  [5/5] Supabase kuruluyor...
call npm install @supabase/supabase-js --legacy-peer-deps
echo        [OK] Supabase kuruldu.
echo.

:: Klasor yapisi (eksikse)
mkdir "app\(tabs)" 2>nul
mkdir "components" 2>nul
mkdir "lib" 2>nul
mkdir "constants\languages" 2>nul
mkdir "assets\fonts" 2>nul

:: Test
echo  ============================================
echo   Test ediliyor...
echo  ============================================
echo.
call npx expo --version
if %errorlevel%==0 (
    echo.
    echo  ============================================
    echo   HER SEY HAZIR!
    echo  ============================================
    echo.
    echo  Baslatmak icin:
    echo    cd %PDIR%
    echo    npx expo start
    echo.
    echo  Siradaki adimlar:
    echo    1. supabase-client.js - lib\supabase.js olarak kopyala
    echo    2. supabase.com - proje olustur
    echo    3. Claude'a gel, siradaki adimi soyle
    echo.
) else (
    echo.
    echo  [!] Bir sorun olabilir. Claude'a bu ciktiyi gonder.
)

:BITTI
echo.
echo  nonoiam - no noise. i am.
echo.
