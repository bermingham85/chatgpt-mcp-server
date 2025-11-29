#!/usr/bin/env pwsh

Write-Host "🚀 ChatGPT MCP Server - Complete Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "1️⃣  Checking Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js $nodeVersion installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Install from: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}
Write-Host ""

# Step 2: Install dependencies
Write-Host "2️⃣  Installing dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    npm install
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✅ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Step 3: Build TypeScript
Write-Host "3️⃣  Building TypeScript..." -ForegroundColor Yellow
npm run build | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Generate SSL certificates
Write-Host "4️⃣  Setting up SSL certificates..." -ForegroundColor Yellow
if (-not (Test-Path "certs\localhost.crt") -or -not (Test-Path "certs\localhost.key")) {
    & .\generate-cert.ps1
} else {
    Write-Host "   ✅ Certificates already exist" -ForegroundColor Green
}
Write-Host ""

# Step 5: Trust the certificate
Write-Host "5️⃣  Trusting SSL certificate..." -ForegroundColor Yellow
if (Test-Path "certs\localhost.cer") {
    try {
        Import-Certificate -FilePath "certs\localhost.cer" -CertStoreLocation Cert:\CurrentUser\Root -ErrorAction Stop | Out-Null
        Write-Host "   ✅ Certificate trusted" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Certificate already trusted or failed to import" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Certificate file not found" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor White
Write-Host ""
Write-Host "1. Start the server:" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In ChatGPT, add this MCP Server URL:" -ForegroundColor Yellow
Write-Host "   https://localhost:3000/sse" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Test in ChatGPT:" -ForegroundColor Yellow
Write-Host "   'List all files in C:\Users\bermi\Projects'" -ForegroundColor Gray
Write-Host ""
