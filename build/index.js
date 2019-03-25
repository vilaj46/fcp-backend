"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _expressSanitizer = _interopRequireDefault(require("express-sanitizer"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var app = (0, _express.default)();
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use((0, _helmet.default)());
app.use((0, _cors.default)());
app.use((0, _expressSanitizer.default)());
app.get('/*', function (req, res) {
  res.sendFile(_path.default.join(__dirname + '/index.html'));
});
app.post('/contact', function (req, res) {
  var information;
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  try {
    if (Object.keys(req.body)[0].includes('WebKitForm')) {
      var values = Object.values(req.body)[0];
      var firstBracket = values.indexOf('{');
      var lastBracket = values.lastIndexOf('}') + 1;
      values = values.slice(firstBracket, lastBracket).replace(/\\/gi, '');
      information = values;
    }
  } catch (_unused) {
    information = JSON.parse(Object.keys(req.body)[0]);
  }

  res.status(200).json({
    sucess: information
  }); // if (information) {
  //     const transporter = nodemailer.createTransport({
  //         host: process.env.TRANSPORT_HOST,
  //         port: process.env.TRANSPORT_PORT,
  //         auth: {
  //             user: process.env.TRANSPORT_USER,
  //             pass: process.env.TRANSPORT_PASS,
  //         }, 
  //         secure: true
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
  //         return res.status('202').json({ mail });
  //     }).catch(error => {
  //         return res.status(400).json({ error });
  //     });
  // } else {
  //     return res.status(400).json({ error });
  // }
});
app.listen(process.env.PORT || 3000, function () {
  return console.log('Listening on port 3000!');
});