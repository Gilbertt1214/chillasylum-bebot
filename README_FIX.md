# 🔧 SOLUSI: Bot Disconnect Terus

## ❌ Masalah
```
⚠ Lavalink node "Serenetia" closed: 1006 - No reason
🔄 Reconnecting to node "Serenetia" in 15s... (3 tries left)
```

## 🎯 Root Cause
**LocalVPS Lavalink Server TIDAK BERJALAN!**
- Bot mencoba connect ke `127.0.0.1:2333` tapi tidak ada yang listening
- Akhirnya bot hanya pakai node public "Serenetia" yang tidak stabil

## ✅ Solusi Cepat

### **Opsi 1: Quick Start (RECOMMENDED)**
```bash
./quick-start.sh
```
**Selesai!** Script akan otomatis:
- ✅ Download Lavalink.jar
- ✅ Jalankan Lavalink Server
- ✅ Jalankan Bot
- ✅ Setup dengan PM2

---

### **Opsi 2: Manual Start**

**Terminal 1 - Jalankan Lavalink:**
```bash
cd lavalink
./start-lavalink.sh
```
*Biarkan terminal ini tetap buka*

**Terminal 2 - Jalankan Bot:**
```bash
node index.js
```

---

## 🔍 Cara Cek Berhasil atau Tidak

### **✅ Berhasil jika muncul:**
```
Lavalink node "LocalVPS" connected
✅ Node "LocalVPS" supports Spotify (LavaSrc)
Bot ready!
```

### **❌ Gagal jika muncul:**
```
⚠ Lavalink node "LocalVPS" closed: 1006
❌ Connection refused on 127.0.0.1:2333
```

**Solusi:** Pastikan Lavalink sudah jalan dulu sebelum bot!

---

## 🛠️ Perintah Berguna

```bash
# Lihat status semua proses
pm2 list

# Lihat log bot
pm2 logs bebot

# Lihat log Lavalink
pm2 logs lavalink-server

# Restart semua
pm2 restart all

# Stop semua
pm2 stop all

# Cek port 2333 listening atau tidak
netstat -tuln | grep 2333
```

---

## 📋 Requirements
- ✅ Java 17 atau lebih baru
- ✅ Node.js
- ✅ PM2 (optional, tapi direkomendasikan)

Install Java:
```bash
sudo apt install openjdk-17-jre-headless
```

Install PM2:
```bash
npm install -g pm2
```

---

## 🎯 Apa yang Sudah Diperbaiki?

1. ✅ Dibuat script `start-lavalink.sh` untuk jalankan Lavalink dengan mudah
2. ✅ Dibuat script `quick-start.sh` untuk jalankan semuanya sekaligus
3. ✅ Update konfigurasi bot agar lebih stabil:
   - `moveOnDisconnect: true` - Otomatis pindah ke node lain
   - `resume: true` - Resume playback setelah reconnect
   - `reconnectTries: 5` - Lebih banyak retry
   - `reconnectInterval: 10` - Lebih cepat reconnect

---

## 📖 Dokumentasi Lengkap
Lihat file `START_BOT.md` untuk panduan lengkap dan troubleshooting detail.

---

**TL;DR:**
```bash
# Jalankan ini dan selesai
./quick-start.sh

# Atau manual:
# Terminal 1: cd lavalink && ./start-lavalink.sh
# Terminal 2: node index.js
```
