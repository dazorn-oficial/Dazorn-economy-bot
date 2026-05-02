const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');
const shopFile = path.join(__dirname, '../data/shop.json');

// --- Manejo de Usuarios ---

/**
 * Obtiene todos los usuarios.
 * @returns {Object} Objeto con los datos de usuarios.
 */
function getUsers() {
    try {
        if (!fs.existsSync(usersFile)) {
            fs.writeFileSync(usersFile, JSON.stringify({}, null, 4));
        }
        const data = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error leyendo users.json", err);
        return {};
    }
}

/**
 * Guarda todos los usuarios en el archivo JSON.
 * @param {Object} data - Datos a guardar.
 */
function saveUsers(data) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Error guardando users.json", err);
    }
}

/**
 * Obtiene los datos de un usuario específico.
 * @param {string} userId - ID del usuario de Discord.
 * @returns {Object} Datos del usuario.
 */
function getUser(userId) {
    const users = getUsers();
    if (!users[userId]) {
        // Inicializa el usuario si no existe
        users[userId] = {
            id: userId,
            balance: 0,
            inventory: [],
            cooldowns: {
                daily: 0,
                work: 0
            }
        };
        saveUsers(users);
    }
    return users[userId];
}

/**
 * Actualiza los datos de un usuario específico.
 * @param {string} userId - ID del usuario de Discord.
 * @param {Object} userData - Datos nuevos.
 */
function updateUser(userId, userData) {
    const users = getUsers();
    users[userId] = userData;
    saveUsers(users);
}

// --- Manejo de Tienda ---

/**
 * Obtiene todos los objetos de la tienda.
 * @returns {Array} Array de objetos en la tienda.
 */
function getShop() {
    try {
        if (!fs.existsSync(shopFile)) {
            fs.writeFileSync(shopFile, JSON.stringify([], null, 4));
        }
        const data = fs.readFileSync(shopFile, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error leyendo shop.json", err);
        return [];
    }
}

/**
 * Guarda los objetos en la tienda.
 * @param {Array} data - Array de objetos a guardar.
 */
function saveShop(data) {
    try {
        fs.writeFileSync(shopFile, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Error guardando shop.json", err);
    }
}

module.exports = {
    getUsers,
    saveUsers,
    getUser,
    updateUser,
    getShop,
    saveShop
};
