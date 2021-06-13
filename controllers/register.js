require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcrypt");

function registerUser(id, email, telnumber, name, password) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;

            const user = JSON.parse(data);

            if (user.length > 0) {
                id = user[user.length - 1].id + 1;
            }

            const user_object = user.map((element) => {
                return element.email;
            });

            const user_telnumber = user.map((element) => {
                return element.telnumber;
            });

            const find_user = user_object.indexOf(email);
            const find_telnumber = user_telnumber.indexOf(parseInt(telnumber));

            if (find_user != -1 || find_telnumber != -1) {
                reject(false); // email or telnumber already exists
            } else {
                let temp_user = {};

                temp_user["id"] = parseInt(id);
                temp_user["name"] = name;
                temp_user["email"] = email;
                temp_user["telnumber"] = parseInt(telnumber);
                temp_user["pass"] = bcrypt.hashSync(password, 10);
                temp_user["passwordResetToken"] = "";
                temp_user["passwordResetExpires_fulldate"] = "";

                user.push(temp_user);

                fs.writeFile("users.json", JSON.stringify(user), (err) => {
                    if (err) throw err;
                    resolve(true); // send true back to the app.js, in order to send something to the front-end or whatever else
                });
            }
        });
    });
}

module.exports = {
    registerUser,
};
