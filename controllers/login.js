require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcrypt");

function LoginUser(email, password) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;
            const user = JSON.parse(data);

            const email_object = user.map((element) => {
                return element.email;
            });

            const find_email = email_object.indexOf(email);

            if (find_email != -1) {
                if (bcrypt.compareSync(password, user[find_email].pass)) {
                    resolve({
                        "email": user[find_email].email,
                        "name": user[find_email].name,
                        "number": user[find_email].telnumber,
                        "userphoto": user[find_email].userphoto
                    }); // login ok, send the data back to the app.js, in order to send something to the front-end or whatever else
                } else {
                    reject("1"); // incorrect password
                }
            } else {
                reject("0"); // email not found
            }
        });
    });
}

module.exports = {
    LoginUser,
};
