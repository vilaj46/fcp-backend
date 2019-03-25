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
app.use(bodyParser.json());

app.use(helmet());
app.use(cors())
app.use(sanitizer());

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/contact', (req, res) => {
    let information;
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    try {
        if (Object.keys(req.body)[0].includes('WebKitForm')) {
            let values = Object.values(req.body)[0];
            const firstBracket = values.indexOf('{');
            const lastBracket = values.lastIndexOf('}') + 1;
            values = values.slice(firstBracket, lastBracket).replace(/\\/gi, '');
            information = values
            return res.status(201).json({ success: true });
        } 
    }
    catch {
        information = {
            name: req.body.name,
            number: req.body.number,
            email: req.body.email,
            assistance: req.body.assistance,
            honey: req.body.honey
        }
        return res.status(202).json({ success: true });
    }
    console.log(information)
    if (information) {
        const transporter = nodemailer.createTransport({
            host: process.env.TRANSPORT_HOST,
            port: process.env.TRANSPORT_PORT,
            auth: {
                user: process.env.TRANSPORT_USER,
                pass: process.env.TRANSPORT_PASS,
            }, 
            secure: true
        });

        const contact = {
            name: req.sanitize(information.name),
            number: req.sanitize(information.number),
            email: req.sanitize(information.email),
            assistance: req.sanitize(information.assistance),
        };

        const mail = {
            from: contact.email,
            to: process.env.TRANSPORT_USER,
            subject: 'Help',
            text: `
                ${contact.name}
                ${contact.email}
                ${contact.number}
                ${contact.assistance}
            `
        };
    
        return transporter.sendMail(mail).then(() => {
            return res.status('200').json({ mail });
        }).catch(error => {
            return res.status(401).json({ error });
        });
    } else {
        return res.status(400).json({ body: req.body });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000!'));