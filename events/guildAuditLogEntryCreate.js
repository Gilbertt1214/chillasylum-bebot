const { AuditLogEvent, EmbedBuilder, PermissionsBitField } = require("discord.js");

// Cache penyimpan jumlah aksi destruktif: Map<userId, {count, firstActionTime}>
const antiNukeCache = new Map();

// PARAMETER ANTI-NUKE
const ACTION_THRESHOLD = 3; // Batas hukuman (3 aksi)
const TIME_LIMIT_MS = 10000; // Dalam waktu 10 detik

// Bug Fix 1: Mencegah Memory Leak dengan membersihkan cache secara berkala
setInterval(() => {
    const now = Date.now();
    for (const [userId, data] of antiNukeCache.entries()) {
        if (now - data.firstActionTime > TIME_LIMIT_MS) {
            antiNukeCache.delete(userId);
        }
    }
}, 30000); // Bersihkan setiap 30 detik

module.exports = {
    name: "guildAuditLogEntryCreate",
    async execute(auditLogEntry, guild) {
        // Bug Fix 4: Validasi Permission VIEW_AUDIT_LOG
        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;

        // Abaikan aksi dari bot ini sendiri agar tidak looping atau ke-ban
        if (auditLogEntry.executorId === guild.client.user.id) return;
        
        // Bug Fix 5: Melengkapi daftar aksi destruktif (ChannelCreate, RoleCreate, WebhookCreate dll)
        const destructiveActions = [
            AuditLogEvent.ChannelDelete,
            AuditLogEvent.ChannelCreate,
            AuditLogEvent.MemberKick,
            AuditLogEvent.MemberBanAdd,
            AuditLogEvent.RoleDelete,
            AuditLogEvent.RoleCreate,
            AuditLogEvent.WebhookCreate
        ];

        // Jika tipe aksinya aman-aman saja, hentikan pembacaan
        if (!destructiveActions.includes(auditLogEntry.action)) return;

        const executorId = auditLogEntry.executorId;
        if (!executorId) return;

        // Abaikan aksi dari Discord Server Owner
        if (executorId === guild.ownerId) return;

        const now = Date.now();
        const userData = antiNukeCache.get(executorId);

        // Jika baru pertama kali melakukan aksi destruktif
        if (!userData) {
            antiNukeCache.set(executorId, { count: 1, firstActionTime: now });
            return;
        }

        // Cek apakah aksi-aksi beruntun ini masih berada di dalam jendela waktu (10 detik)
        if (now - userData.firstActionTime > TIME_LIMIT_MS) {
            // Sudah lewat rentang batas waktu, reset catatannya
            antiNukeCache.set(executorId, { count: 1, firstActionTime: now });
            return;
        }

        // Jika di dalam *time-window* 10 detik aksi tetap bertambah
        userData.count += 1;
        antiNukeCache.set(executorId, userData);

        // Jika batas threshold tercapai (TANDANYA AKUN DI-HACK & MENCOBA NUKE!)
        if (userData.count >= ACTION_THRESHOLD) {
            
            // 1. Coba berikan hukuman Ban Permanen kepada si pelaku!
            try {
                // Fetch member agar bisa mengetahui siapa dirinya di log
                const member = await guild.members.fetch(executorId).catch(() => null);
                
                // Bug Fix 2: Validasi Permission BAN_MEMBERS pada bot
                if (!guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                    throw new Error("Bot tidak diberikan permission BAN_MEMBERS oleh server.");
                }

                // Bug Fix 3: Pengecekan Hierarchy Role (Apakah bot bisa nge-ban target?)
                if (member && !member.bannable) {
                    throw new Error("Hierarki Role pelaku lebih tinggi atau setara dengan Bot.");
                }
                
                await guild.members.ban(executorId, {
                    reason: `Sistem Anti-Nuke: Melakukan ${userData.count} aksi destruktif dalam ${TIME_LIMIT_MS/1000} detik!`
                });
                
                // 2. Beri peringatan merah ke Mod-Logs
                const logChannel = guild.channels.cache.find(c => 
                    c.name === "mod-logs" || c.name === "logs" || c.name === "server-logs"
                );
                
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle("☢️ SISTEM ANTI-NUKE TERPICU!")
                        .setColor("#FF0000")
                        .setDescription(`Ada akun yang sedang kesurupan merusak server! Akun tersebut telah **DI-BANNED OTOMATIS** oleh Sistem.`)
                        .addFields(
                            { name: "Pelaku Penghancur", value: member ? `${member.user} (${member.user.tag})` : `<@${executorId}> (ID: ${executorId})`, inline: false },
                            { name: "Aksi Terakhir", value: LogEventName(auditLogEntry.action), inline: true },
                            { name: "Total Nuke", value: `${userData.count} aksi / ${TIME_LIMIT_MS/1000} detik`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: "Sistem Keamanan Server" });
                        
                    logChannel.send({ embeds: [embed] }).catch(() => {});
                }

                // Hapus namanya dari cache pengintaian karena sudah berhasil terbuang
                antiNukeCache.delete(executorId);

            } catch (error) {
                console.error("Gagal melakukan eksekusi Anti-Nuke BAN:", error);
                
                // Coba kirimkan log gagal
                const logChannel = guild.channels.cache.find(c => 
                    c.name === "mod-logs" || c.name === "logs" || c.name === "server-logs"
                );
                
                if (logChannel) {
                    logChannel.send(`☢️ **BAHAYA DARURAT!** Upaya Nuke hebat terdeteksi dilakukan oleh <@${executorId}>! \n\n⚠️ **BOT GAGAL MENGHUKUM PELAKU KARENA:**\n\`${error.message}\`\n\n*(Tolong segera Banned/Kick pelaku secara manual dan periksa pengaturan permission bot Anda!)*`).catch(()=>{});
                }
                
                antiNukeCache.delete(executorId); // Hapus agar tidak spam error berulang kali tiap aksi barunya
            }
        }
    }
};

// Fungsi kecil agar nama errornya di Embed lebih cantik
function LogEventName(action) {
    switch (action) {
        case AuditLogEvent.ChannelDelete: return "Mass Channel Delete 🗑️";
        case AuditLogEvent.ChannelCreate: return "Mass Channel Create 📝";
        case AuditLogEvent.MemberKick: return "Mass Kick Member 👢";
        case AuditLogEvent.MemberBanAdd: return "Mass Banning Member 🔨";
        case AuditLogEvent.RoleDelete: return "Mass Role Delete 📛";
        case AuditLogEvent.RoleCreate: return "Mass Role Create 👑";
        case AuditLogEvent.WebhookCreate: return "Mass Webhook Create 🔗";
        default: return "Destructive Action 💥";
    }
}
