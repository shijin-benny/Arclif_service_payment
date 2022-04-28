const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { google } = require('googleapis');
const async = require('hbs/lib/async');
//= ======================== credentials ===============================//
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
//========================= Google Oauth2 ===============================//
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//=========================   smtp setup  ==================================//
async function sendEmail(mailOptions) {
    try {
        const accesstoken = await oauth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 't67206475@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accesstoken
            }
        });
        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        return error;
    }
}  

