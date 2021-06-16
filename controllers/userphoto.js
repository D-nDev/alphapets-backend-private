const fs = require('fs');

function userPhoto(email, link) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;
            const user = JSON.parse(data);

            const email_object = user.map((element) => {
                return element.email;
            });

            const find_email = email_object.indexOf(email);

            user[find_email].userphoto = link;

            fs.writeFile("users.json", JSON.stringify(user), (err) => {
                if (err) throw err;
                resolve(user[find_email].userphoto); // send true back to the app.js, in order to send something to the front-end or whatever else
            });
        });
    })
}

module.exports = {
    userPhoto,
}
