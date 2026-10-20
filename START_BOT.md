# 🤖 Panduan Menjalankan ChillAsylum BeBot

## 📋 Masalah yang Ditemukan

Berdasarkan analisis log:

### ❌ **Masalah Utama:**
1. **LocalVPS Lavalink Server TIDAK BERJALAN**
   - Bot mencoba connect ke `127.0.0.1:2333` tapi tidak ada yang listening
   - Ini penyebab utama kenapa bot bergantung pada node public yang tidak stabil

2. **Node "Serenetia" Tidak Stabil**
   - Terus disconnect dengan code 1006 (No reason) dan 1000 (timeout)
   - Node public free sering overload karena terlalu banyak user

### ✅ **Solusi:**
Menjalankan Lavalink Server lokal yang lebih stabil dan cepat!

---

## 🚀 Cara Menjalankan Bot (Langkah-langkah)

### **Step 1: Jalankan Lavalink Server Lokal**

**Terminal 1 - Jalankan Lavalink:**
```bash
cd lavalink
./start-lavalink.sh
```

Script ini akan:
- ✅ Otomatis download Lavalink.jar jika belum ada
- ✅ Cek Java version (minimal Java 17)
- ✅ Jalankan Lavalink Server di port 2333

**Output yang benar:**
```
🚀 Menjalankan Lavalink Server...
Port: 2333
Password: ChillAsylumBebot2026

INFO 12345 --- [Lavalink] [main] lavalink.server.Launcher: Started Launcher in X.XXX seconds
```

**PENTING:** 
- Biarkan terminal ini tetap terbuka/running
- Jangan tekan Ctrl+C (akan stop Lavalink)

---

### **Step 2: Jalankan Discord Bot**

**Terminal 2 - Jalankan Bot (buka terminal baru):**
```bash
cd /path/ke/chillasylum-bebot
node index.js
```

atau jika pakai PM2:
```bash
pm2 start index.js --name bebot
pm2 logs bebot
```

**Output yang benar:**
```
🎵 Loaded 3 Lavalink node(s) from configuration
Lavalink node "LocalVPS" connected
✅ Node "LocalVPS" supports Spotify (LavaSrc)
Bot ready! Logged in as BeBot#1234
```

---

## 🔍 Cara Mengecek Status

### **Cek apakah Lavalink berjalan:**
```bash
# Cek port 2333 listening
netstat -tuln | grep 2333

# Atau
ss -tuln | grep 2333

# Atau test dengan curl
curl http://localhost:2333/version
```

**Output yang benar:**
```
tcp   0   0   0.0.0.0:2333   0.0.0.0:*   LISTEN
```

### **Cek log bot:**
```bash
# Jika pakai PM2
pm2 logs bebot --lines 50

# Jika pakai node langsung, lihat di terminal
```

**Log yang BAIK (tidak ada error):**
```
Lavalink node "LocalVPS" connected
✅ Node "LocalVPS" supports Spotify
🎵 Bermain: Nama Lagu
```

**Log yang BURUK (ada masalah):**
```
⚠ Lavalink node "LocalVPS" closed: 1006
❌ Lavalink node "LocalVPS" error: Connection refused
```

---

## 🛠️ Troubleshooting

### **Problem 1: "Java tidak ditemukan"**
```bash
# Install Java 17
sudo apt update
sudo apt install openjdk-17-jre-headless

# Cek versi
java -version
```

### **Problem 2: Port 2333 sudah digunakan**
```bash
# Cek proses yang pakai port 2333
lsof -i :2333

# Kill proses (ganti PID dengan nomor yang muncul)
kill -9 <PID>
```

### **Problem 3: Node LocalVPS tetap tidak connect**
```bash
# Restart Lavalink
# Di terminal Lavalink, tekan Ctrl+C
# Tunggu 5 detik
# Jalankan lagi: ./start-lavalink.sh

# Restart Bot
pm2 restart bebot
# atau
# Ctrl+C lalu node index.js lagi
```

### **Problem 4: Bot masih pakai node Serenetia**
Pastikan:
1. ✅ Lavalink LocalVPS sudah running (cek dengan `netstat -tuln | grep 2333`)
2. ✅ File `.env` sudah benar (LAVALINK_NODE_1_URL=127.0.0.1:2333)
3. ✅ Restart bot setelah Lavalink running

---

## 📊 Penjelasan Node Priority

Bot akan otomatis pilih node dengan prioritas:

1. **LocalVPS** (127.0.0.1:2333) - **PRIORITY 1** ⭐
   - Paling cepat (no latency)
   - Paling stabil (server sendiri)
   - Support Spotify via plugin

2. **TriniumHost** (lavalink-v4.triniumhost.com:443) - **FALLBACK 1**
   - Public node, cukup stabil
   - Pakai jika LocalVPS down

3. **Serenetia** (lavalinkv4.serenetia.com:443) - **FALLBACK 2**
   - Public node, sering overload
   - Hanya dipakai jika 2 node lain down

---

## ⚙️ Konfigurasi yang Sudah Diperbaiki

### **Perubahan di `utils/lavalink.js`:**
```javascript
// Sebelum (Tidak stabil):
moveOnDisconnect: false,
resume: false,
reconnectTries: 3,
reconnectInterval: 15,

// Sesudah (Lebih stabil):
moveOnDisconnect: true,  // Otomatis pindah ke node lain
resume: true,             // Resume playback setelah reconnect
reconnectTries: 5,        // Lebih banyak retry
reconnectInterval: 10,    // Lebih cepat reconnect
```

---

## ✅ Checklist Sebelum Menjalankan Bot

- [ ] Java 17+ terinstall (`java -version`)
- [ ] File `.env` sudah ada dan benar
- [ ] Lavalink Server berjalan (`netstat -tuln | grep 2333`)
- [ ] Node modules terinstall (`npm install`)
- [ ] Bot token valid di `.env`
- [ ] Spotify credentials valid di `.env`

---

## 📝 Command Bermanfaat

```bash
# Jalankan Lavalink (Terminal 1)
cd lavalink && ./start-lavalink.sh

# Jalankan Bot (Terminal 2)
node index.js

# Atau dengan PM2
pm2 start lavalink/start-lavalink.sh --name lavalink-server
pm2 start index.js --name bebot
pm2 logs

# Restart semua
pm2 restart all

# Stop semua
pm2 stop all
```

---

## 🎯 Expected Behavior Setelah Fix

**Saat bot berjalan dengan baik:**
```
0|bebot | 🎵 Loaded 3 Lavalink node(s) from configuration
0|bebot | Lavalink node "LocalVPS" connected
0|bebot | ✅ Node "LocalVPS" supports Spotify (LavaSrc)
0|bebot | Rate-limit handler patched for node "LocalVPS"
0|bebot | Bot ready! Logged in as BeBot#1234
```

**Tidak akan ada lagi:**
```
⚠ Lavalink node "Serenetia" closed: 1006 - No reason
🔄 Reconnecting to node "Serenetia" in 15s...
```

---

## 💡 Tips

1. **Selalu jalankan Lavalink dulu, baru Bot**
2. **Gunakan PM2 untuk auto-restart jika crash**
3. **Monitor log secara berkala** (`pm2 logs`)
4. **Jangan expose port 2333 ke internet** (hanya untuk localhost)

---

## 🆘 Butuh Bantuan?

Jika masih ada error setelah mengikuti panduan ini:

1. Jalankan: `pm2 logs bebot --lines 100 > bot-error.log`
2. Jalankan: `pm2 logs lavalink-server --lines 100 > lavalink-error.log`
3. Kirim kedua file log tersebut untuk analisis lebih lanjut

---

**Dibuat oleh:** Kiro AI Assistant
**Tanggal:** 28 September 2026
**Versi:** 1.0
