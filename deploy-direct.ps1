param (
    [string]$ServerUser = "user",
    [string]$ServerHost = "your-server-ip",
    [string]$ServerDir = "/opt/umkm-app"
)

$ImageName = "umkm-web:latest"
$ArchiveName = "umkm-web.tar.gz"

Write-Host "🚀 [1/4] Building production image secara lokal..." -ForegroundColor Green
docker build --target runner -t $ImageName .

Write-Host "📦 [2/4] Mengompresi Docker Image menjadi $ArchiveName..." -ForegroundColor Green
docker save $ImageName | gzip > $ArchiveName

Write-Host "📡 [3/4] Mengirim image & file konfigurasi ke server production..." -ForegroundColor Green
ssh "${ServerUser}@${ServerHost}" "mkdir -p ${ServerDir}"
scp $ArchiveName docker-compose.prod.yml .env "${ServerUser}@${ServerHost}:${ServerDir}/"

Write-Host "🔄 [4/4] Mengimpor image & menjalankan container di server production..." -ForegroundColor Green
ssh "${ServerUser}@${ServerHost}" "cd ${ServerDir} && docker load < ${ArchiveName} && cp docker-compose.prod.yml docker-compose.yml && docker compose up -d --remove-orphans && rm -f ${ArchiveName}"

Write-Host "✅ Deployment ke server production BERHASIL!" -ForegroundColor Cyan
