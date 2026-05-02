require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuración básica desde .env
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX || '!';
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // Solo si se quiere registrar rápido en un servidor de pruebas

// Ajustes: qué sistemas quieres usar (puedes cambiar a false para desactivar)
const USE_SLASH = process.env.USE_SLASH === 'false' ? false : true;
const USE_PREFIX = process.env.USE_PREFIX === 'false' ? false : true;

// Crear cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Importante para leer comandos prefix
        GatewayIntentBits.GuildMembers
    ]
});

// Colecciones para guardar los comandos en memoria
client.slashCommands = new Collection();
client.prefixCommands = new Collection();

// --- CARGADOR DE COMANDOS SLASH ---
const slashCommandsData = [];
if (USE_SLASH) {
    const slashPath = path.join(__dirname, 'src', 'commands', 'slash');
    // Leemos las subcarpetas si las hay, o directamente los archivos
    // Para simplificar, buscaremos recursivamente
    const loadSlashCommands = (dir) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                loadSlashCommands(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);
                if (command.data && command.execute) {
                    client.slashCommands.set(command.data.name, command);
                    slashCommandsData.push(command.data.toJSON());
                }
            }
        }
    };
    loadSlashCommands(slashPath);
}

// --- CARGADOR DE COMANDOS PREFIX ---
if (USE_PREFIX) {
    const prefixPath = path.join(__dirname, 'src', 'commands', 'prefix');
    const loadPrefixCommands = (dir) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                loadPrefixCommands(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);
                if (command.name && command.execute) {
                    client.prefixCommands.set(command.name, command);
                }
            }
        }
    };
    loadPrefixCommands(prefixPath);
}

// --- EVENTO: CUANDO EL BOT ESTÁ LISTO ---
client.once('ready', async () => {
    console.log(`✅ ¡Bot conectado como ${client.user.tag}!`);

    // Registrar o eliminar comandos slash en la API de Discord
    if (TOKEN && CLIENT_ID) {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        try {
            if (USE_SLASH) {
                console.log('🔄 Registrando comandos slash (/) ...');
                if (GUILD_ID) {
                    // Registro local
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: slashCommandsData });
                    console.log('✅ Comandos slash registrados en el servidor de pruebas.');
                } else {
                    // Registro global
                    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommandsData });
                    console.log('✅ Comandos slash registrados de forma global.');
                }
            } else {
                console.log('🗑️ USE_SLASH está en false. Eliminando comandos slash (/) de Discord...');
                if (GUILD_ID) {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
                } else {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
                }
                console.log('✅ Comandos slash eliminados de la interfaz.');
            }
        } catch (error) {
            console.error('❌ Error gestionando comandos slash:', error);
        }
    }
});

// --- EVENTO: MANEJO DE INTERACCIONES (COMANDOS SLASH) ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand() || !USE_SLASH) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        // Ejecutar el comando
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error al ejecutar comando slash ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
        }
    }
});

// --- EVENTO: MANEJO DE MENSAJES (COMANDOS PREFIX) ---
client.on('messageCreate', async message => {
    // Evitar que lea mensajes de otros bots o no use prefix
    if (!USE_PREFIX || message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Error al ejecutar comando prefix ${commandName}:`, error);
        message.reply('Hubo un error al ejecutar el comando.');
    }
});

// Iniciar sesión en Discord
if (!TOKEN) {
    console.error("❌ NO HAY TOKEN CONFIGURADO. Revisa tu archivo .env");
} else {
    client.login(TOKEN);
}
