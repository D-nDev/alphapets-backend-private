require("dotenv").config();
const fs = require("fs");
const totalvoice = require("totalvoice-node");
const client = new totalvoice(process.env.SMS_KEY); // your key from totalvoice

function sendSms(usernumber, token) {
    return new Promise((resolve, reject) => {
        fs.readFile("users.json", (err, data) => {
            if (err) throw err;
            const user = JSON.parse(data);

            const telnumber_object = user.map((element) => {
                return element.telnumber;
            });

            const find_telnumber = telnumber_object.indexOf(
                parseInt(usernumber)
            );

            if (find_telnumber != -1) {
                const user_response = false;
                const multi_sms = true;
                const create_date = "";
                const message =
                    "Here is your code to AlphaPets:" +
                    "\n" +
                    token +
                    "                                    " +
                    "Use your code at: " +
                    "/resetpass"; // sms message
                client.sms
                    .enviar(
                        usernumber,
                        message.replace(/\|/g, "\n"),
                        user_response,
                        multi_sms,
                        create_date
                    )
                    .then((data) => {
                        console.log(data);
                        const expire = new Date();
                        expire.setHours(expire.getHours() + 1);

                        user[find_telnumber].passwordResetToken = token;
                        user[find_telnumber].passwordResetExpires_fulldate =
                            expire;

                        fs.writeFile(
                            "users.json",
                            JSON.stringify(user),
                            (err) => {
                                if (err) throw err;
                                resolve(true); // send back to the app.js, in order to send something to the front-end or whatever else
                            }
                        );
                    })
                    .catch((error) => {
                        console.error("Error: ", error);
                        reject(error.data.mensagem);
                    });
            } else {
                reject("Mobile number not found");
            }
        });
    });
}

module.exports = {
    sendSms,
};
