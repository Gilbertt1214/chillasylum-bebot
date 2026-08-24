const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "economy.json");

// Pastikan folder dan file ada
function ensureData() {
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");
}

function getData() {
    ensureData();
    try {
        const raw = fs.readFileSync(dataPath, "utf8");
        return JSON.parse(raw || "{}");
    } catch (e) {
        console.error("⚠️ Failed to parse economy.json, backing up and resetting:", e.message);
        try {
            fs.copyFileSync(dataPath, `${dataPath}.bak.${Date.now()}`);
        } catch (_) {}
        return {};
    }
}

function saveData(data) {
    ensureData();
    const tempPath = `${dataPath}.tmp.${process.pid}.${Date.now()}`;
    try {
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
        fs.renameSync(tempPath, dataPath);
    } catch (err) {
        console.error("❌ Failed to save economy data atomically:", err.message);
        if (fs.existsSync(tempPath)) {
            try { fs.unlinkSync(tempPath); } catch (_) {}
        }
    }
}

function getUser(userId) {
    const data = getData();
    if (!data[userId]) {
        data[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
        saveData(data);
    }
    return data[userId];
}

function updateUser(userId, updates) {
    const data = getData();
    const currentUser = data[userId] || { balance: 0, lastDaily: 0, lastWork: 0 };
    data[userId] = { ...currentUser, ...updates };
    saveData(data);
    return data[userId];
}

function addBalance(userId, amount) {
    const user = getUser(userId);
    return updateUser(userId, { balance: user.balance + amount });
}

function removeBalance(userId, amount) {
    const user = getUser(userId);
    const newBalance = Math.max(0, user.balance - amount);
    return updateUser(userId, { balance: newBalance });
}

function getAllUsers() {
    return getData();
}

module.exports = {
    getUser,
    updateUser,
    addBalance,
    removeBalance,
    getAllUsers,
};
