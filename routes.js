const express = require("express");
const cookie_parser = require("cookie-parser");
const crypto = require("crypto");
const app = express();
const router = express.Router();
const cors = require('cors');
app.use(cors());

app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());
app.use(cookie_parser("1234"));

// require all controllers, that have all functionalities
const register = require("./controllers/register");
const loginuser = require("./controllers/login");
const checkemail = require("./controllers/checkemail");
const sendmail = require("./controllers/sendemail");
const sendsms = require("./controllers/sendsms");
const resetpass = require("./controllers/resetpass");
const newpet = require("./controllers/registerPet");
const schedule = require('./controllers/schedule');
const userPhoto = require('./controllers/userphoto');
const changePass = require('./controllers/changepass');
const getPets = require('./controllers/getPets');
const getSchedules = require('./controllers/getSchedules');
const unSchedule = require('./controllers/unSchedule');

// register a new user
router.post("/register", (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const id = 1;
    const name = req.body.name;
    const email = req.body.email;
    const telnumber = req.body.telnumber;
    const pass = req.body.pass;

    const new_user = register.registerUser(id, email, telnumber, name, pass);

    new_user
        .then((result_response) => {
            res.send(result_response);
        })
        .catch((error) => {
            res.send(error);
        });
});

// log-in the user
router.post("/login", (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const email = req.body.email;
    const password = req.body.password;

    const login_user = loginuser.LoginUser(email, password);

    login_user
        .then((result_response) => {
            console.log("E-mail: " + result_response.email);
            console.log("Nome: " + result_response.name);
            console.log("Telefone: " + result_response.number);
            /*res.cookie("name", result_response, {
                maxAge: 172800000,
                signed: true,
            }); // cookie valid for 3 days
            res.cookie("email", email, {
                maxAge: 172800000,
                signed: true,
            }); // cookie valid for 3 days*/
            res.send(result_response);
        })
        .catch((error) => {
            res.send(error);
        });
});

// this should be called on the person wanna log-off
/*router.post("/logout", (req, res) => {
    res.clearCookie("email");
    res.clearCookie("name");
    res.send("Ok");
});*/

// if you wanna test if the login is working, you can test with a integrated front-end or postman/imsonia
router.get("/test", (req, res) => {
    if (!req.signedCookies.email) {
        res.send("Please log-in");
    } else {
        res.send("Yay");
    }
});

router.get("/check", (req, res) => {
    /*if (req.signedCookies.email == undefined) {
        console.log("ERROR");
    } else {
        console.log(req.signedCookies.email.length);
    }*/
    res.send(req.signedCookies.email); // check if user is logged-in
})

// forgot pass by email
router.post("/forgotpass", (req, res) => {
    const email = req.body.email;
    const user_browser = req.body.user_browser;
    const user_os = req.body.user_os;
    const user_osversion = req.body.user_osversion;
    const user_ip = req.body.user_ip;

    const token = crypto.randomBytes(20).toString("hex");

    const test_email = checkemail.checkEmail(email, token);

    test_email
        .then(() => {
            sendmail
                .sendEmail(
                    email,
                    token,
                    user_browser,
                    user_os,
                    user_osversion,
                    user_ip
                )
                .then((response) => {
                    res.send(response);
                })
                .catch((error) => {
                    res.send(error);
                    console.log(error);
                });
        })
        .catch((error) => {
            res.send(error);
            console.log(error);
        });
});

// forgot pass by sms
router.post("/forgotpass2", (req, res) => {
    const telnumber = req.body.telnumber;
    const token = crypto.randomBytes(20).toString("hex");

    const reset_pass_sms = sendsms.sendSms(telnumber, token);

    reset_pass_sms
        .then((result_response) => {
            res.send(result_response);
        })
        .catch((error) => {
            res.send(error);
        });
});

// reset the password with code sent to the sms/email
router.post("/resetpass", (req, res) => {
    const token = req.body.token;
    const newpass = req.body.newpass_user;

    const token_exists = resetpass.resetPass(token, newpass);

    token_exists
        .then((resolve) => {
            res.send(resolve);
        })
        .catch((error) => {
            res.send(error);
        });
});

router.post("/newpet", (req, res) => {
    const id = 1;
    const name = req.body.name;
    const age = req.body.age;
    const weight = req.body.weight;
    const breed = req.body.breed;
    const type = req.body.type;
    const owner_email = req.body.owner_email;
    const photo = req.body.photo;

    const pet = newpet.registerPet(
        id,
        name,
        age,
        weight,
        breed,
        type,
        owner_email,
        photo
    );

    pet.then((response) => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    });
});

router.post("/schedule", (req, res) => {
    const id = 1;
    const description = req.body.description_schedule;
    const owner_email = req.body.owner_email;
    const pet_id = req.body.pet_id;
    const pet_name = req.body.pet_name;
    const date = req.body.date_schedule;

    const newschedule = schedule.schedule(id, description, owner_email, pet_id, pet_name, date);

    newschedule.then((response) => {
        console.log(response);
        res.send(response);
    }).catch((error) => {
        console.log(error);
        res.send(error);
    })
})

router.post("/setphoto", (req, res) => {
    const email = req.body.email;
    const link = req.body.link;
    const newphoto = userPhoto.userPhoto(email, link);

    newphoto.then((response) => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    })
})

router.post("/changepass", (req, res) => {
    const email = req.body.email;
    const user_oldpass = req.body.user_oldpass;
    const user_newpass = req.body.user_newpass;

    const changeuserPass = changePass.changePass(email, user_oldpass, user_newpass)

    changeuserPass.then((response) => {
        console.log(response)
        res.send(response);
    }).catch((error) => {
        console.log(error)
        res.send(error);
    })
})

router.get("/getpets", (req, res) => {
    const email = req.query.email;
    console.log(`EMAIL: ${email}`);
    const userpets = getPets.getPets(email);

    userpets.then((response) => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    })
})

router.get("/getschedules", (req, res) => {
    const email = req.query.email;

    const userschedules = getSchedules.getSchedules(email);

    userschedules.then((response) => {
        res.send(response);
    }).catch((error) => {
        console.log(error);
        res.send(error);
    })
})

router.post("/unschedule", (req, res) => {
    const email = req.body.email;
    const pid = req.body.pid;
    console.log(email);
    console.log(pid);

    const deleteSchedule = unSchedule.removeSchedule(email, pid);

    deleteSchedule.then((response) => {
        res.send(response);
    }).catch((error) => {
        console.log(error);
        res.send(error);
    })
})

module.exports = router;
