import * as nodemailer from "nodemailer";

export async function sendEmail(email: string, url) {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    const mailOptions = {
        from: '"John Doe 👻" <john-doe@mail.com>',
        to: email,
        subject: "Hello ✔",
        text: "Hello world?",
        html: `<a href="${url}">${url}</a>`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message Sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}