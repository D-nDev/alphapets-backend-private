const fs = require('fs');
const bcrypt = require("bcrypt");

function changePass(email, oldpass, newpass) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;
            const user = JSON.parse(data);

            const email_object = user.map((element) => {
                return element.email;
            });

            const find_email = email_object.indexOf(email);

            if (bcrypt.compareSync(oldpass, user[find_email].pass)) {
                user[find_email].pass = bcrypt.hashSync(newpass, 10);
                fs.writeFile("users.json", JSON.stringify(user), (err) => {
                    if (err) throw err;
                    resolve('Ok'); // send true back to the app.js, in order to send something to the front-end or whatever else
                });
            }
            else {
                reject('Senha antiga incorreta');
            }
        });
    })
}

module.exports = {
    changePass,
}
