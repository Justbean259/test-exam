@echo off
mkdir "..\frontend\src\contract"
mkdir "..\backend\src\contract"

xcopy /E /I /Y "..\contract" "..\frontend\src\contract"
xcopy /E /I /Y "..\contract" "..\backend\src\contract"

pause
