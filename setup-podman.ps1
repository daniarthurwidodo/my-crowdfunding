# PowerShell script to set up PostgreSQL with Podman
# This script helps set up the PostgreSQL database using Podman on Windows

param(
    [switch]$Help,
    [switch]$Stop,
    [switch]$Remove
)

if ($Help) {
    Write-Host "PostgreSQL Setup Script for Podman`n" -ForegroundColor Cyan
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\setup-podman.ps1              # Start PostgreSQL container"
    Write-Host "  .\setup-podman.ps1 -Stop        # Stop PostgreSQL container"
    Write-Host "  .\setup-podman.ps1 -Remove      # Remove PostgreSQL container"
    Write-Host "  .\setup-podman.ps1 -Help        # Show this help`n"
    exit 0
}

# Check if podman is installed
if (!(Get-Command podman -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Podman is not installed. Please install Podman first." -ForegroundColor Red
    Write-Host "   Download from: https://podman.io/getting-started/installation#windows" -ForegroundColor Yellow
    exit 1
}

if ($Stop) {
    Write-Host "🛑 Stopping PostgreSQL container..." -ForegroundColor Yellow
    podman stop crowdfunding-postgres 2>$null
    Write-Host "✅ PostgreSQL container stopped" -ForegroundColor Green
    exit 0
}

if ($Remove) {
    Write-Host "🗑️  Removing PostgreSQL container..." -ForegroundColor Yellow
    podman rm -f crowdfunding-postgres 2>$null
    Write-Host "✅ PostgreSQL container removed" -ForegroundColor Green
    exit 0
}

Write-Host "🚀 Setting up PostgreSQL with Podman for My Crowdfunding Platform" -ForegroundColor Cyan

# Create podman network if it doesn't exist
Write-Host "📡 Creating podman network..." -ForegroundColor Blue
podman network create crowdfunding-network 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Network created" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Network already exists" -ForegroundColor Gray
}

# Start PostgreSQL container
Write-Host "🐘 Starting PostgreSQL container..." -ForegroundColor Blue
podman run -d `
    --name crowdfunding-postgres `
    --network crowdfunding-network `
    -e POSTGRES_DB=crowdfunding `
    -e POSTGRES_USER=crowdfunding_user `
    -e POSTGRES_PASSWORD=crowdfunding_password `
    -p 5432:5432 `
    -v crowdfunding-postgres-data:/var/lib/postgresql/data `
    --restart unless-stopped `
    docker.io/postgres:15-alpine

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL container started" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start PostgreSQL container" -ForegroundColor Red
    exit 1
}

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if PostgreSQL is running
$containerStatus = podman ps --format "{{.Names}}" | Select-String -Pattern "^crowdfunding-postgres$"
if ($containerStatus) {
    Write-Host "✅ PostgreSQL container is running" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL container is not running" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 PostgreSQL setup complete!`n" -ForegroundColor Green

Write-Host "📋 Connection Details:" -ForegroundColor Cyan
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Port: 5432" -ForegroundColor White
Write-Host "   Database: crowdfunding" -ForegroundColor White
Write-Host "   Username: crowdfunding_user" -ForegroundColor White
Write-Host "   Password: crowdfunding_password" -ForegroundColor White

Write-Host "`n🛠️  Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs: podman logs crowdfunding-postgres" -ForegroundColor White
Write-Host "   Stop DB: .\setup-podman.ps1 -Stop" -ForegroundColor White
Write-Host "   Start DB: podman start crowdfunding-postgres" -ForegroundColor White
Write-Host "   Remove DB: .\setup-podman.ps1 -Remove" -ForegroundColor White

Write-Host "`n📄 Make sure your .env file has:" -ForegroundColor Cyan
Write-Host "   DATABASE_URL=postgresql://crowdfunding_user:crowdfunding_password@localhost:5432/crowdfunding" -ForegroundColor White

Write-Host "`n🔗 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Copy .env.example to .env" -ForegroundColor White
Write-Host "   2. Run 'npm run db:migrate' to set up the database schema" -ForegroundColor White
Write-Host "   3. Run 'npm run dev' to start the application" -ForegroundColor White