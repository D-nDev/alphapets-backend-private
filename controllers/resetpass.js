require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcrypt");

function resetPass(token, newpass) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;
            const user = JSON.parse(data);

            const now = new Date();

            const user_object = user.map((element) => {
                return element.passwordResetToken;
            });

            const find_token = user_object.indexOf(token);

            if (find_token == -1) {
                reject("0"); // token not found
            } else if (user[find_token].passwordResetToken != token) {
                reject("1"); // invalid token
            } else if (
                now > new Date(user[find_token].passwordResetExpires_fulldate)
            ) {
                reject("2"); // token expired
            } else {
                user[find_token].pass = bcrypt.hashSync(newpass, 10);
                user[find_token].passwordResetToken = "";
                user[find_token].passwordResetExpires_fulldate = "";

                fs.writeFile("users.json", JSON.stringify(user), (err) => {
                    if (err) throw err;
                    resolve("Ok"); // send back to the app.js, in order to send something to the front-end or whatever else
                });
            }
        });
    });
}

module.exports = {
    resetPass,
};
