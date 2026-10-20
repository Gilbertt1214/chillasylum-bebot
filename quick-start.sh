#!/bin/bash

# Quick Start Script untuk ChillAsylum BeBot
# Script ini akan otomatis menjalankan Lavalink dan Bot

echo "🤖 ChillAsylum BeBot - Quick Start"
echo "=================================="
echo ""

# Cek apakah Java terinstall
if ! command -v java &> /dev/null; then
    echo "❌ Java tidak ditemukan!"
    echo "Install Java 17 dengan: sudo apt install openjdk-17-jre-headless"
    exit 1
fi

# Cek apakah Node.js terinstall
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan!"
    echo "Install Node.js terlebih dahulu"
    exit 1
fi

# Cek apakah .env ada
if [ ! -f ".env" ]; then
    echo "❌ File .env tidak ditemukan!"
    echo "Copy .env.example ke .env dan isi konfigurasi yang diperlukan"
    exit 1
fi

# Cek apakah PM2 terinstall
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 tidak ditemukan, menginstall..."
    npm install -g pm2
fi

echo "✅ Semua requirements terpenuhi"
echo ""

# Stop proses lama jika ada
echo "🧹 Membersihkan proses lama..."
pm2 delete lavalink-server 2>/dev/null || true
pm2 delete bebot 2>/dev/null || true

echo ""
echo "🚀 Menjalankan Lavalink Server..."
pm2 start lavalink/start-lavalink.sh --name lavalink-server --time

# Tunggu Lavalink siap (max 30 detik)
echo "⏳ Menunggu Lavalink siap..."
for i in {1..30}; do
    if netstat -tuln 2>/dev/null | grep -q ":2333" || ss -tuln 2>/dev/null | grep -q ":2333"; then
        echo "✅ Lavalink Server sudah running di port 2333"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ Lavalink gagal start dalam 30 detik"
        echo "Cek log dengan: pm2 logs lavalink-server"
        exit 1
    fi
    
    sleep 1
done

echo ""
echo "🚀 Menjalankan Discord Bot..."
pm2 start index.js --name bebot --time

echo ""
echo "✅ Bot sudah berjalan!"
echo ""
echo "📊 Monitoring:"
echo "  pm2 logs              - Lihat semua log"
echo "  pm2 logs bebot        - Lihat log bot saja"
echo "  pm2 logs lavalink-server - Lihat log Lavalink saja"
echo "  pm2 monit             - Monitor real-time"
echo ""
echo "🛑 Stop bot:"
echo "  pm2 stop all"
echo ""
echo "🔄 Restart bot:"
echo "  pm2 restart all"
echo ""

# Tampilkan log selama 5 detik
echo "Menampilkan log bot (5 detik)..."
echo "=================================="
sleep 2
pm2 logs bebot --lines 20 --nostream
