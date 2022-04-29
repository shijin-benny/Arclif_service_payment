const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { google } = require('googleapis');
const async = require('hbs/lib/async');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

//========================== credentials ===============================//
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
        // template engine setting
        const handlebarsOptions = {
            viewEngine: {
                extName: '.hbs',
                partialsDir: './views/',
                defaultLayout: false,
            },
            viewPath: path.resolve('./views/'),
            extName: '.hbs'
        }
        transport.use('compile', hbs(handlebarsOptions));        
        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        return error;
    }
}  

module.exports = {
    receiptMail:(order)=>{
        const amount = order.amount / 100;
        const fee = order.fee / 100;
        const tax = order.tax / 100;
        const total = amount + fee + tax;
       return new Promise((resolve,reject)=>{
           const mailOptions = {
               from: 't67206475@gmail.com',
                to: order.email,
                subject: 'Order Receipt',
                template: 'receipt',
                context: {
                    paymentId: order.id,
                    orderId: order.order_id ,
                    amount: amount,
                    email: order.email,
                    status: order.status,
                    method: order.method,
                    fee:fee,
                    tax : tax,
                    total: total
                },
                attachments: [
                    {
                        filename: 'arclifLogo.png',
                        path: './public/images/arclifLogo.png',
                        cid: 'arclifLogo'
                    },
                ]
            }
            sendEmail(mailOptions).then(result=>{
                resolve(result);
            }
            ).catch(error=>{
                reject(error);
            }
            )
       })
    }
}
