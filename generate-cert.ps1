#!/usr/bin/env pwsh

Write-Host "🔐 Generating self-signed SSL certificate..." -ForegroundColor Cyan
Write-Host ""

# Create certs directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "certs" | Out-Null

# Generate self-signed certificate
$cert = New-SelfSignedCertificate `
    -Subject "localhost" `
    -DnsName "localhost", "127.0.0.1" `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -NotBefore (Get-Date) `
    -NotAfter (Get-Date).AddYears(5) `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -FriendlyName "ChatGPT MCP Server" `
    -HashAlgorithm SHA256 `
    -KeyUsage DigitalSignature, KeyEncipherment, DataEncipherment `
    -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")

Write-Host "✅ Certificate created with thumbprint: $($cert.Thumbprint)" -ForegroundColor Green
Write-Host ""

# Export certificate
$certPath = "certs\localhost.pfx"
$cerPath = "certs\localhost.cer"
$password = ConvertTo-SecureString -String "chatgpt-mcp" -Force -AsPlainText

Export-PfxCertificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" -FilePath $certPath -Password $password | Out-Null
Export-Certificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" -FilePath $cerPath | Out-Null

Write-Host "✅ Certificate exported to:" -ForegroundColor Green
Write-Host "   PFX: $certPath" -ForegroundColor Gray
Write-Host "   CER: $cerPath" -ForegroundColor Gray
Write-Host ""

# Convert PFX to PEM format for Node.js
Write-Host "🔄 Converting to PEM format..." -ForegroundColor Cyan

# Extract private key and certificate
openssl pkcs12 -in $certPath -nocerts -out "certs\localhost.key" -nodes -passin pass:chatgpt-mcp 2>$null
openssl pkcs12 -in $certPath -nokeys -out "certs\localhost.crt" -passin pass:chatgpt-mcp 2>$null

if (Test-Path "certs\localhost.key") {
    Write-Host "✅ PEM files created:" -ForegroundColor Green
    Write-Host "   Key: certs\localhost.key" -ForegroundColor Gray
    Write-Host "   Cert: certs\localhost.crt" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎉 SSL setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Trust the certificate" -ForegroundColor Yellow
    Write-Host "   Run: Import-Certificate -FilePath 'certs\localhost.cer' -CertStoreLocation Cert:\CurrentUser\Root" -ForegroundColor Gray
} else {
    Write-Host "⚠️  OpenSSL not found. Installing using winget..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install OpenSSL manually:" -ForegroundColor Red
    Write-Host "   Option 1: winget install -e --id ShiningLight.OpenSSL" -ForegroundColor Gray
    Write-Host "   Option 2: Download from https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After installing OpenSSL, run this script again." -ForegroundColor Yellow
}

Write-Host ""
