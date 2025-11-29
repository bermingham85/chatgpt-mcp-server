#!/usr/bin/env pwsh

Write-Host "🚀 Starting ChatGPT MCP Server..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if dist exists
if (-not (Test-Path "dist")) {
    Write-Host "🔨 Building TypeScript..." -ForegroundColor Yellow
    npm run build
}

# Start the server
Write-Host ""
Write-Host "✨ Starting server..." -ForegroundColor Green
Write-Host ""
Write-Host "📋 Available endpoints:" -ForegroundColor White
Write-Host "   SSE: http://localhost:3000/sse" -ForegroundColor Gray
Write-Host "   Health: http://localhost:3000/health" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Use this URL in ChatGPT:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/sse" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

node dist/http-server.js
