#!/bin/bash

# Script untuk menjalankan Lavalink Server
# Dibuat untuk ChillAsylum BeBot

LAVALINK_DIR="$(cd "$(dirname "$0")" && pwd)"
LAVALINK_JAR="$LAVALINK_DIR/Lavalink.jar"
LAVALINK_VERSION="4.0.8"
DOWNLOAD_URL="https://github.com/lavalink-devs/Lavalink/releases/download/$LAVALINK_VERSION/Lavalink.jar"

echo "🎵 ChillAsylum BeBot - Lavalink Starter"
echo "========================================"
echo ""

# Cek apakah Java terinstall
if ! command -v java &> /dev/null; then
    echo "❌ Java tidak ditemukan!"
    echo "Install Java 17 terlebih dahulu:"
    echo "  sudo apt install openjdk-17-jre-headless"
    exit 1
fi

# Cek versi Java
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
echo "☕ Java version: $(java -version 2>&1 | head -n 1)"

if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "⚠️  Java 17 atau lebih baru diperlukan untuk Lavalink v4"
    echo "Install dengan: sudo apt install openjdk-17-jre-headless"
    exit 1
fi

# Download Lavalink.jar jika belum ada
if [ ! -f "$LAVALINK_JAR" ]; then
    echo ""
    echo "📥 Lavalink.jar tidak ditemukan, mendownload..."
    echo "URL: $DOWNLOAD_URL"
    
    if command -v wget &> /dev/null; then
        wget -O "$LAVALINK_JAR" "$DOWNLOAD_URL"
    elif command -v curl &> /dev/null; then
        curl -L -o "$LAVALINK_JAR" "$DOWNLOAD_URL"
    else
        echo "❌ wget atau curl tidak ditemukan!"
        echo "Install dengan: sudo apt install wget"
        exit 1
    fi
    
    if [ ! -f "$LAVALINK_JAR" ]; then
        echo "❌ Download gagal!"
        exit 1
    fi
    
    echo "✅ Download selesai!"
fi

# Cek apakah application.yml ada
if [ ! -f "$LAVALINK_DIR/application.yml" ]; then
    echo "❌ application.yml tidak ditemukan di $LAVALINK_DIR"
    exit 1
fi

# Jalankan Lavalink
echo ""
echo "🚀 Menjalankan Lavalink Server..."
echo "Port: 2333"
echo "Password: ChillAsylumBebot2026"
echo ""
echo "Tekan Ctrl+C untuk stop"
echo "========================================"
echo ""

cd "$LAVALINK_DIR"
exec java -jar "$LAVALINK_JAR"
