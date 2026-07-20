#!/bin/bash

echo "Memulai instalasi Lavalink v4 di VPS..."

# 1. Update sistem dan install Java 17 (Syarat Lavalink v4)
echo "Menginstall Java 17..."
sudo apt update
sudo apt install -y openjdk-17-jre-headless wget unzip

# 2. Pindah ke direktori lavalink yang sudah kita buat
cd ~/bebot/lavalink

# 3. Download file Lavalink v4 terbaru (v4.0.8)
echo "Mendownload Lavalink.jar..."
wget -O Lavalink.jar https://github.com/lavalink-devs/Lavalink/releases/download/4.0.8/Lavalink.jar

# 4. Membuat konfigurasi application.yml
cat <<EOF > application.yml
lavalink:
  plugins:
    - dependency: "dev.lavalink.youtube:youtube-plugin:1.11.5"
      repository: "https://maven.lavalink.dev/releases"

plugins:
  youtube:
    enabled: true
    allowSearch: true
    allowDirectVideoIds: true
    allowDirectPlaylistIds: true
    clients:
      - MUSIC
      - ANDROID
      - WEB
EOF

echo ""
echo "Instalasi selesai!"
echo "Sekarang kamu bisa menjalankan Lavalink dengan command:"
echo "pm2 start java --name 'lavalink' -- -jar Lavalink.jar"
echo "Pastikan kamu menjalankan command pm2 di dalam folder ~/bebot/lavalink"
