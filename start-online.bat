@echo off
chcp 65001 >nul
title Hệ Thống Chung Sức Tự Động - Online Server & Tunnel
echo ===================================================
echo   ĐANG KHỞI ĐỘNG HỆ THỐNG TRỰC TUYẾN...
echo ===================================================

echo [1/2] Khởi động Server...
start "Chung Suc Server" /min powershell -ExecutionPolicy Bypass -File .\server.ps1

timeout /t 3 /nobreak >nul

echo [2/2] Mở đường link công khai (Cloudflare Tunnel)...
.\cloudflared.exe tunnel --url http://localhost:8080 --http-host-header localhost
pause
