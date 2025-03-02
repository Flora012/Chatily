const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true, // false, mert STARTTLS kell
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    },
    tls: {
        rejectUnauthorized: false // 🔹 Kikapcsolja a tanúsítvány ellenőrzést
    }
});

async function sendFriendRequestEmail(toEmail, requesterName) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Például: "noreply@yourdomain.com"
            to: toEmail,
            subject: "Új barátjelölés!",
            text: `${requesterName} barátnak jelölt téged az alkalmazásban!`,
            html: `<p><strong>${requesterName}</strong> barátnak jelölt téged az alkalmazásban!</p>`
        };
        console.log(mailOptions.to)

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email elküldve: ${toEmail}`);
    } catch (error) {
        console.error("❌ Email küldési hiba:", error);
    }
}

module.exports = { sendFriendRequestEmail };
