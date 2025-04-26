const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const app = express();
const port = 3000;

// Initialize WhatsApp client
const client = new Client();

// When QR code is generated, show it in the terminal
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code generated! Scan it with your WhatsApp app.');
});

// When the client is ready, log it to the console
client.on('ready', () => {
    console.log('WhatsApp is ready!');
});

// API endpoint to get QR code
app.get('/qr', (req, res) => {
    res.json({ message: 'QR Code generated. Scan with WhatsApp.' });
});

// API endpoint to send a message to a specific contact
app.post('/send-message', express.json(), (req, res) => {
    const { phoneNumber, message } = req.body;
    if (!phoneNumber || !message) {
        return res.status(400).send('Phone number and message are required.');
    }

    const contact = `${phoneNumber}@c.us`; // Convert to WhatsApp's format
    client.sendMessage(contact, message)
        .then(() => res.send('Message sent successfully!'))
        .catch(err => res.status(500).send('Error sending message: ' + err));
});

// Initialize the WhatsApp client
client.initialize();

// Start Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
