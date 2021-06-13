require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcrypt");

function resetPass(email, token, newpass) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;
            const user = JSON.parse(data);

            const now = new Date();

            const email_object = user.map((element) => {
                return element.email;
            });

            const find_email = email_object.indexOf(email);

            if (find_email == -1) {
                reject("0"); // email not found
            } else if (user[find_email].passwordResetToken != token) {
                reject("1"); // invalid token
            } else if (
                now > new Date(user[find_email].passwordResetExpires_fulldate)
            ) {
                reject("2"); // token expired
            } else {
                user[find_email].pass = bcrypt.hashSync(newpass, 10);
                user[find_email].passwordResetToken = "";
                user[find_email].passwordResetExpires_fulldate = "";

                fs.writeFile("users.json", JSON.stringify(user), (err) => {
                    if (err) throw err;
                    resolve("3"); // send back to the app.js, in order to send something to the front-end or whatever else
                });
            }
        });
    });
}

module.exports = {
    resetPass,
};
