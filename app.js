const express = require("express");
const cookie_parser = require("cookie-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.port || 3333;

app.use(cookie_parser("1234")); // force to sign the cookie
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require("./routes")); // require all routes created on routes.js

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
