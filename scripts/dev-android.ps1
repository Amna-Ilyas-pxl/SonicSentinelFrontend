# Run Metro + install app on connected Android device
# Usage: .\scripts\dev-android.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Checking device..." -ForegroundColor Cyan
$devices = adb devices | Select-String "device$"
if (-not $devices) {
    Write-Host "No Android device found. Connect USB, enable USB debugging, then run again." -ForegroundColor Red
    exit 1
}

Write-Host "Forwarding Metro port 8081..." -ForegroundColor Cyan
adb reverse tcp:8081 tcp:8081

Write-Host "Building and installing app..." -ForegroundColor Cyan
npx react-native run-android

Write-Host "Done. Keep Metro running in another terminal: npx react-native start" -ForegroundColor Green
