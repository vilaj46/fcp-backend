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
app.use(_bodyParser.default.json());
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
      return res.status(201).json({
        success: true
      });
    }
  } catch (_unused) {
    information = {
      name: req.body.name,
      number: req.body.number,
      email: req.body.email,
      assistance: req.body.assistance,
      honey: req.body.honey
    };
    return res.status(202).json({
      success: true
    });
  }

  console.log(information);

  if (information) {
    var _transporter = _nodemailer.default.createTransport({
      host: process.env.TRANSPORT_HOST,
      port: process.env.TRANSPORT_PORT,
      auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS
      },
      secure: true
    });

    var contact = {
      name: req.sanitize(information.name),
      number: req.sanitize(information.number),
      email: req.sanitize(information.email),
      assistance: req.sanitize(information.assistance)
    };
    var mail = {
      from: contact.email,
      to: process.env.TRANSPORT_USER,
      subject: 'Help',
      text: "\n                ".concat(contact.name, "\n                ").concat(contact.email, "\n                ").concat(contact.number, "\n                ").concat(contact.assistance, "\n            ")
    };
    return _transporter.sendMail(mail).then(function () {
      return res.status('200').json({
        mail: mail
      });
    }).catch(function (error) {
      return res.status(401).json({
        error: error
      });
    });
  } else {
    var _contact = {
      name: req.sanitize(req.body.name),
      number: req.sanitize(req.body.number),
      email: req.sanitize(req.body.email),
      assistance: req.sanitize(req.body.assistance)
    };
    var _mail = {
      from: _contact.email,
      to: process.env.TRANSPORT_USER,
      subject: 'Help',
      text: "\n                ".concat(_contact.name, "\n                ").concat(_contact.email, "\n                ").concat(_contact.number, "\n                ").concat(_contact.assistance, "\n            ")
    };
    return transporter.sendMail(_mail).then(function () {
      return res.status('200').json({
        mail: _mail
      });
    }).catch(function (error) {
      return res.status(401).json({
        error: error
      });
    }); // return res.status(400).json({ body: req.body });
  }
});
app.listen(process.env.PORT || 3000, function () {
  return console.log('Listening on port 3000!');
});