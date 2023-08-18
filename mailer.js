const nodemailer = require('nodemailer')
const config = require('./config.json')
async function mail(data) {
    let transporter = nodemailer.createTransport({
        host: config.smtpHost, // SMTP Server
            port: 465,  // SMTP Port
            secure: true, // SSL
            auth: {
                user: config.user, // Username
                pass: config.pass // Password
            }
        })

        let info = await transporter.sendMail({
            from: {
                name: 'Rew1nd Pinger', // Who is sending the email
                address: 'noreply@rew1nd.com', 
            },
            to: config.to, // Who is the email being sent to
            subject: data.subject,
            text: data.msg,
        })
}

exports.mail = mail;