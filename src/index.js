import express from 'express';
import path from 'path';
import sanitizer from 'express-sanitizer';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(helmet());
app.use(cors())
app.use(sanitizer());

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/contact', (req, res) => {
    let information;
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    res.status(200).json({ success: req.body });
    // if (Object.keys(req.body)[0].includes('WebKitForm')) {
    //     const values = Object.values(req.body);
    //     const firstBracket = values[0].indexOf('{');
    //     const lastBracket = values[0].lastIndexOf('}') + 1;
    //     information = JSON.parse(values[0].slice(firstBracket, lastBracket));
    // } else if (Object.keys(req.body).length > 0) {
    //     information = JSON.parse(Object.keys(req.body)[0]);
    // }
    
    // return res.status('200').end();
    // if (information) {
    //     const transporter = nodemailer.createTransport({
    //         host: process.env.TRANSPORT_HOST,
    //         port: process.env.TRANSPORT_PORT,
    //         auth: {
    //             user: process.env.TRANSPORT_USER,
    //             pass: process.env.TRANSPORT_PASS,
    //         }
    //     });

    //     const contact = {
    //         name: req.sanitize(information.name),
    //         number: req.sanitize(information.number),
    //         email: req.sanitize(information.email),
    //         assistance: req.sanitize(information.assistance),
    //     };

    //     const mail = {
    //         from: contact.email,
    //         to: process.env.TRANSPORT_USER,
    //         subject: 'Help',
    //         text: `
    //             ${contact.name}
    //             ${contact.email}
    //             ${contact.number}
    //             ${contact.assistance}
    //         `
    //     };
    
    //     return transporter.sendMail(mail).then(() => {
    //         return res.status('200').end('Success!');
    //     }).catch(error => {
    //         return res.status(400).end('Something went wrong.');
    //     });
    // } else {
    //     return res.send('hety now youre a rockstart');
    // }
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000!'));