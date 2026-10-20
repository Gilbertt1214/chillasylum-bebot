#!/bin/bash

echo "🔍 ChillAsylum BeBot - Status Check"
echo "===================================="
echo ""

# Cek proses PM2
echo "📊 PM2 Processes:"
if command -v pm2 &> /dev/null; then
    pm2 list
else
    echo "❌ PM2 tidak terinstall"
fi

echo ""
echo "=================================="
echo ""

# Cek port 2333 (Lavalink)
echo "🎵 Lavalink Port Check (2333):"
if netstat -tuln 2>/dev/null | grep -q ":2333" || ss -tuln 2>/dev/null | grep -q ":2333"; then
    echo "✅ Port 2333 LISTENING - Lavalink running"
    netstat -tuln 2>/dev/null | grep ":2333" || ss -tuln 2>/dev/null | grep ":2333"
else
    echo "❌ Port 2333 TIDAK LISTENING - Lavalink tidak running"
fi

echo ""
echo "=================================="
echo ""

# Test koneksi ke Lavalink
echo "🔗 Test Koneksi ke Lavalink:"
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:2333/version 2>/dev/null | grep -q "200\|401"; then
    echo "✅ Lavalink REACHABLE"
    echo "Response:"
    curl -s http://127.0.0.1:2333/version 2>/dev/null || echo "Need auth"
else
    echo "❌ Lavalink TIDAK REACHABLE"
fi

echo ""
echo "=================================="
echo ""

# Cek log bot terbaru (cari file log)
echo "📝 Log Bot Terbaru:"
if [ -f "$HOME/.pm2/logs/bebot-out.log" ]; then
    echo "File: $HOME/.pm2/logs/bebot-out.log"
    tail -n 15 "$HOME/.pm2/logs/bebot-out.log" | grep -E "(Lavalink|Node|connected|closed|Error|error)" || tail -n 10 "$HOME/.pm2/logs/bebot-out.log"
elif [ -f "/home/fahri/.pm2/logs/bebot-out.log" ]; then
    echo "File: /home/fahri/.pm2/logs/bebot-out.log"
    tail -n 15 "/home/fahri/.pm2/logs/bebot-out.log" | grep -E "(Lavalink|Node|connected|closed|Error|error)" || tail -n 10 "/home/fahri/.pm2/logs/bebot-out.log"
else
    echo "⚠️  Log file tidak ditemukan"
fi

echo ""
echo "=================================="
echo ""

# Cek log Lavalink
echo "🎵 Log Lavalink Terbaru:"
if [ -f "$HOME/.pm2/logs/lavalink-server-out.log" ]; then
    tail -n 10 "$HOME/.pm2/logs/lavalink-server-out.log" | grep -E "(Started|ERROR|WARN|INFO)" | tail -n 5
elif [ -f "/home/fahri/.pm2/logs/lavalink-server-out.log" ]; then
    tail -n 10 "/home/fahri/.pm2/logs/lavalink-server-out.log" | grep -E "(Started|ERROR|WARN|INFO)" | tail -n 5
else
    echo "⚠️  Log file tidak ditemukan"
fi

echo ""
echo "=================================="
echo ""
echo "✅ Status check selesai!"
