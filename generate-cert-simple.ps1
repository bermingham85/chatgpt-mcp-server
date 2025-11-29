#!/usr/bin/env pwsh

Write-Host "🔐 Generating self-signed SSL certificate..." -ForegroundColor Cyan
Write-Host ""

# Create certs directory
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
    -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1") `
    -KeyExportPolicy Exportable

Write-Host "✅ Certificate created" -ForegroundColor Green
Write-Host ""

# Export PFX
$certPath = "certs\localhost.pfx"
$cerPath = "certs\localhost.cer"
$password = ConvertTo-SecureString -String "chatgpt-mcp" -Force -AsPlainText

Export-PfxCertificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" -FilePath $certPath -Password $password | Out-Null
Export-Certificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" -FilePath $cerPath | Out-Null

Write-Host "✅ Certificate exported" -ForegroundColor Green
Write-Host ""

# Convert to PEM using PowerShell
Write-Host "🔄 Converting to PEM format (PowerShell method)..." -ForegroundColor Cyan

# Load the certificate
$pfxCert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certPath, "chatgpt-mcp", [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)

# Export certificate to PEM
$certPem = "-----BEGIN CERTIFICATE-----`n"
$certPem += [System.Convert]::ToBase64String($pfxCert.RawData, [System.Base64FormattingOptions]::InsertLineBreaks)
$certPem += "`n-----END CERTIFICATE-----"
$certPem | Out-File -FilePath "certs\localhost.crt" -Encoding ASCII

# Export private key to PEM
$rsaKey = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($pfxCert)
$keyBytes = $rsaKey.Key.Export([System.Security.Cryptography.CngKeyBlobFormat]::Pkcs8PrivateBlob)
$keyPem = "-----BEGIN PRIVATE KEY-----`n"
$keyPem += [System.Convert]::ToBase64String($keyBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$keyPem += "`n-----END PRIVATE KEY-----"
$keyPem | Out-File -FilePath "certs\localhost.key" -Encoding ASCII

Write-Host "✅ PEM files created:" -ForegroundColor Green
Write-Host "   certs\localhost.crt" -ForegroundColor Gray
Write-Host "   certs\localhost.key" -ForegroundColor Gray
Write-Host ""

# Trust the certificate
Write-Host "🔐 Trusting certificate..." -ForegroundColor Cyan
try {
    Import-Certificate -FilePath $cerPath -CertStoreLocation Cert:\CurrentUser\Root -ErrorAction Stop | Out-Null
    Write-Host "✅ Certificate trusted!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Certificate may already be trusted" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 SSL setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the server with:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
