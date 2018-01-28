const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// View Engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static resources
app.use('/public', express.static(path.join(__dirname, 'public')));


//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
        <p>New Contact Request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'viktar.miliuk@yandex.ru', // user
            pass: '1234'  //password
        },
        tls: {
            secure: true,
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Viktar Miliuk 👻" <viktar.miliuk@yandex.ru>', // sender address
        to: 'mv@tut.by, vms74@mail.ru', // list of receivers
        subject: 'Test message from NodeJS app', // Subject line
        //text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg: 'E-mail has been sent'})

    });    
});

app.listen(3000, () => console.log('Server started...'));