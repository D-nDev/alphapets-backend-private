const fs = require("fs");

function checkEmail(email, token) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;
            const user = JSON.parse(data);

            const email_object = user.map((element) => {
                return element.email;
            });

            const find_email = email_object.indexOf(email);

            if (find_email == -1) {
                reject("Email not found"); // reject the promise
            } else {
                const expire = new Date();
                expire.setHours(expire.getHours() + 1);

                user[find_email].passwordResetToken = token;
                user[find_email].passwordResetExpires_fulldate = expire;

                fs.writeFile("users.json", JSON.stringify(user), (err) => {
                    if (err) throw err;
                    resolve(user[find_email].email); // send the email back to the app.js, in order to send something to the front-end or whatever else
                });
            }
        });
    });
}

module.exports = {
    checkEmail,
};
