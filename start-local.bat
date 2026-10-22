@echo off
chcp 65001 >nul
title Hệ Thống Chung Sức Tự Động - Local Server
echo ===================================================
echo   ĐANG KHỞI ĐỘNG HỆ THỐNG CHUNG SỨC TỰ ĐỘNG (http://localhost:8080)...
echo ===================================================
start http://localhost:8080
powershell -ExecutionPolicy Bypass -File .\server.ps1
pause
