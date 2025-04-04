const { default: makeWASocket, useMultiFileAuthState } = require("baileys");
const qrcode = require("qrcode-terminal");

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
            console.log("🔥 Bot conectado ao WhatsApp!");
        } else if (connection === "close") {
            console.log("❌ Conexão fechada!", lastDisconnect);
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        console.log(`📩 Mensagem de ${sender}: ${text}`);

        if (text?.toLowerCase() === "oi") {
            await sock.sendMessage(sender, { text: "Olá! Como posso ajudar?" });
        }
    });
}

connectToWhatsApp();
