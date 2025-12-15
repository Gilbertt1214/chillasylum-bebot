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
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function saveData(data) {
    ensureData();
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
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
    data[userId] = { ...getUser(userId), ...updates };
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
