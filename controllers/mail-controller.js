const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { google } = require("googleapis");


const OAuth2 = google.auth.OAuth2;

const emailAddress = 'noreply@cputrades.com'
const adminEmailAddress = 'cputrades@gmail.com'

const hostname = 'cputrades.com';

const oauth2Client = new OAuth2(
    "553298682404-epqbut9fh0ln0hhqhohvvllub732ntlq.apps.googleusercontent.com", // ClientID
    "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", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1//04s4duJaxIaiLCgYIARAAGAQSNwF-L9Ir3_u6kTnVYy2J3EgX0Q_HA-v5SGGaedv97GqtP8uJnc_tUPSrKFxPM1aO6sDeU4ZRv_s"
});
const accessToken = oauth2Client.getAccessToken()

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    name: 'www.cputrades.com',
    host: 'smtp.gmail.com',
    //port: 587,
    //secure: false,
    port: 465,
    secure: true, // true for 465, false for other ports
    tls: { 
        ciphers: 'SSLv3',
        // rejectUnauthorized: false
    },
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: 'info@cputrades.com',
        clientId: "553298682404-epqbut9fh0ln0hhqhohvvllub732ntlq.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04s4duJaxIaiLCgYIARAAGAQSNwF-L9Ir3_u6kTnVYy2J3EgX0Q_HA-v5SGGaedv97GqtP8uJnc_tUPSrKFxPM1aO6sDeU4ZRv_s",
        accessToken: accessToken
        // pass: 'Bernice@100'
    },
});

transporter.set("oauth2_provision_cb", (user, renew, callback) => {
    let accessToken = userTokens[user];
    if (!accessToken) {
      return callback(new Error("Unknown user"));
    } else {
      return callback(null, accessToken);
    }
});

function setupReceiversOptions(email, data, subject = "no-reply") {
    const options = {
        from: `"CPU TRADES" <${emailAddress}>`,
        to: email,
        subject,
        html: data,
        attachments: [
            {
                filename: 'logo.jpg',
                path: path.resolve('assets/mail/logo.jpg'),
                cid: 'logo'
            },
            {
                filename: 'fb.png',
                path: path.resolve('assets/mail/fb.png'),
                cid: 'fb'
            },
            {
                filename: 'in.png',
                path: path.resolve('assets/mail/in.png'),
                cid: 'in'
            },
            {
                filename: 'insta.png',
                path: path.resolve('assets/mail/insta.png'),
                cid: 'insta'
            },
            {
                filename: 'x.png',
                path: path.resolve('assets/mail/x.png'),
                cid: 'x'
            },
            {
                filename: 'padlock.png',
                path: path.resolve('assets/mail/padlock.png'),
                cid: 'padlock'
            }
        ]
    };

    return options;
}

function setAdminReceiveOptions(data, adminMail = adminEmailAddress) {
    const options = {
        from: emailAddress,
        to: adminMail,
        subject: "no-reply",
        html: data,
        attachments: []
    };
    return options;
}

function adminMailTemplate(text, isConfirmation = false, confirmLink = "", declineLink = "") {
    let data = "" 
    if (isConfirmation) {
        data = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
            </head>
            <body>
                <div>${text}</div>
                <div><a href="${confirmLink}" style="color: green; margin-bottom: 30px; font-size: 20px; font-weight: 800">Approve</a></div>
                <div style="height: 100px"></div>
                <div><a href="${declineLink}" style="color: red; font-size: 20px; font-weight: 800">Decline</a></div>
            </body>
            </html>
        `;
    } else {
        data = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
            </head>
            <body>
                <div>${text}</div>
            </body>
            </html>
        `;
    }
    return data;
}

const sendContactResponse = async(name, email, message) => {

    //replying the user
    const p1 = 'Thank you for contacting CPU Trades. This is to acknowledge your email has been received and your inquiry is important to us.'
    const p2 = "Someone from CPU Trades would reach out to you soon. We appreciate your patience and understanding."
    const title = ""
    
    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const options = setupReceiversOptions(email, userData, 'Automatic Reply');
    let result = await transporter.sendMail(options);

    //notifying the admin
    let data2 = adminMailTemplate(`You have received a message from: ${name} <br /> with email address: ${email} <br /> and message body: ${message}`)
    let secondOptions = setAdminReceiveOptions(data2, 'info@cputrades.com');
    let result2 = await transporter.sendMail(secondOptions);

    console.log(result.messageId, result2.messageId);
    return 'Message recieved, we will get back to you shortly';
}

const sendOtp = async(otp, email, name) => {
    var link = ``;
    var link_title = otp;
    var title = "OTP";
    var p1 = "Below is your verification code. This code would expire in 15 minutes";
    var p2 = "Please do not share this code with anyone.";

    let read = await ejs.renderFile(path.resolve('views/mails/otp.ejs'), { link, name, title, link_title, p1, p2 });

    const options = setupReceiversOptions(email, read);

    let result = await transporter.sendMail(options);

    console.log(result.messageId);

    return "An email has been sent. Use it to confirm your details";
}

const sendResetToken = async(email, name, token, id, title = "Reset Password") => {
    var link = `${hostname}/reset-password/${token}/${id}`;
    var link_title = "Reset"
    var p1 = `We have received a ${title} request from you`
    var p2 = "Please click on the reset button below to reset your details. If you can't see the button, click on the link instead."

    let read = await ejs.renderFile(path.resolve('views/mails/otp.ejs'), { link, name, title, link_title, p1, p2 });

    const options = setupReceiversOptions(email, read);

    let result = await transporter.sendMail(options);

    console.log(result.messageId);

    return "An email has been sent. Use it to reset your details";
}

const sendWithdraw = async(email, name, coin_address = "") => {
    const p1 = `We have received your withdrawal request to the following address ${coin_address}.`
    const p2 = "Please exercise some patience while we process it."
    const title = "Withdrawal Request"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData);

    const adminData = adminMailTemplate(`A user ${name} has requested for withdrawal. Please visit your dashboard to process it.`)
    let adminOptions = setAdminReceiveOptions(adminData);

    let userResult = await transporter.sendMail(userOptions);
    let adminResult = await transporter.sendMail(adminOptions);

    console.log(userResult.messageId , adminResult.messageId);
}

const sendDeposit = async(email, name, amount = 0, attachments = [], coin = "") => {
    const p1 = `You have a pending deposit of ${amount} ${coin} to your wallet. We will notify you as soon as the deposit is confirmed.`
    const p2 = "Please exercise some patience while we process it."
    const title = "Deposit Request"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData);

    const adminData = adminMailTemplate(`A user ${name} has a pending ${amount} deposit. Please visit your dashboard to process it.`)
    let adminOptions = setAdminReceiveOptions(adminData);
    adminOptions.attachments = attachments;

    let userResult = await transporter.sendMail(userOptions);
    let adminResult = await transporter.sendMail(adminOptions);

    console.log(userResult.messageId , adminResult.messageId);
}

const confirmTransaction = async(email, name, isDeposit = true, amount = 0) => {
    const p1 = isDeposit ? `Your $${amount} deposit has been successfully processed and credited to your wallet. You can now log in to your cputrades.com Dashboard to view the details.` : 
        `Your $${amount} withdrawal has been successfully processed. You can now log in to your cputrades.com Dashboard to view the details.`
    const p2 = "Thank you for choosing CPU Trades."
    const title = isDeposit ? "Deposit Successful" : "Withdrawal Successful"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData);

    let userResult = await transporter.sendMail(userOptions);

    console.log(userResult.messageId);
}

const declineTransaction = async(email, name, isDeposit = true, amount = 0) => {
    const p1 = isDeposit ? `We regret to inform you that your $${amount} deposit has been declined due to unforeseen circumstances. We kindly advise you to retry sending the deposit through your exchange platform.` : 
        `We regret to inform you that your $${amount} withdrawal has been declined due to unforeseen circumstances. We kindly advise you to retry the withdrawal.`
    const p2 = 'If you encounter any difficulties or need assistance, please don\'t hesitate to reach out to our support team at info@cputrades.com'
    const title = isDeposit ? "Deposit Failed" : "Withdrawal Failed"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData);

    let userResult = await transporter.sendMail(userOptions);

    console.log(userResult.messageId);
}

const sendPlanPurchase = async(email, name, plan = "") => {
    const p1 = `Your ${plan} plan purchase has been successfully processed. You can now log in to your cputrades.com Dashboard to view the details.`
    const p2 = "Thank you for choosing CPU Trades."
    const title = "Purchase Plan"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData);

    let userResult = await transporter.sendMail(userOptions);

    console.log(userResult.messageId);
}

const sendWelcomeMail = async(email, name) => {
    const p1 = `We're delighted to welcome you to the CPU Trades community. Your account has been successfully verified and approved.`
    const p2 = "We're excited to have you join us on your investment journey. Please log in to your account today to explore our offerings and get started. If you have any questions or need assistance, our customer support team is available to help."
    const title = "Welcome to CPU Trades"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData, 'Leo From CPU Trades🎈🎈');

    let userResult = await transporter.sendMail(userOptions);
    console.log(userResult.messageId);
}

const sendVerificationFailedMail = async(email, name) => {
    const p1 = `We're delighted to welcome you to the CPU Trades community. But unfortunately we could not verify your identity at this point.`
    const p2 = "Please log in to your account today to retry verification. If you have any questions or need assistance, our customer support team is available to help."
    const title = "Welcome to CPU Trades"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData, 'Leo From CPU Trades🎈🎈');

    let userResult = await transporter.sendMail(userOptions);
    console.log(userResult.messageId);
}

const sendReferralMail = async(email, name) => {
    const p1 = `We're excited to inform you that your CPU Trades account has been credited with $25 USD for successfully referring a new user. This credit is now available in your dashboard.`
    const p2 = `Additionally, we're pleased to announce that your referred contact has signed up using your referral link. This is a great chance to connect with them and encourage them to purchase a plan on our platform. 
    For each deposit they make, you'll earn a 2% commission, making your referral even more rewarding.
    If you need help supporting your referral, please don't hesitate to reach out. \nThanks for being part of our referral program!`
    const title = "New Referral"

    const userData = await ejs.renderFile(path.resolve('views/mails/non-otp.ejs'), { name, p1, p2, title });
    const userOptions = setupReceiversOptions(email, userData);

    let userResult = await transporter.sendMail(userOptions);
    console.log(userResult.messageId);
}

const notifyAdmin = async(id, attachments, name, email, address, state, country) => {
    let confirmLink = `https://admin.${hostname}/confirm-user/${id}/1`, declineLink = `https://admin.${hostname}/confirm-user/${id}/0`;
    const adminData = adminMailTemplate(
        `Below you'd find this user's verification document. Please review it. <br /> Fullname: ${name} <br /> Email: ${email} <br /> Address: ${address} <br /> state: ${state} <br /> country: ${country}`, 
        true, 
        confirmLink, 
        declineLink
    );
    let adminOptions = setAdminReceiveOptions(adminData);
    adminOptions.attachments = attachments;
    let adminResult = await transporter.sendMail(adminOptions);
    console.log(adminResult.messageId);
}

module.exports = {sendWithdraw, sendWelcomeMail, sendResetToken, sendOtp, notifyAdmin, sendVerificationFailedMail, sendContactResponse, sendDeposit, sendPlanPurchase, confirmTransaction, declineTransaction, sendReferralMail}