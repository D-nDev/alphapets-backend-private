const fs = require("fs");

function removeSchedule(email, id) {
    return new Promise((resolve, reject) => {
        fs.readFile("schedules.json", (err, data) => {
            if (err) throw err;

            const schedules = JSON.parse(data);

            const schedule_object = schedules.map((element) => {
                return element.id;
            });

            //console.log(`id ai ó ${id}`);
            //console.log(schedule_object);
            //console.log(typeof(schedule_object[0]));
            //console.log(typeof(id));

            const find_schedule = schedule_object.indexOf(parseInt(id));
            //console.log(find_schedule);
            //console.log(schedules[find_schedule]);

            if (schedules[find_schedule].owner_email == email) {
                schedules.splice(find_schedule, 1);

                fs.writeFile(
                    "schedules.json",
                    JSON.stringify(schedules),
                    (err) => {
                        if (err) throw err;
                        resolve("Ok"); // send back to the app.js, in order to send something to the front-end or whatever else
                    }
                );
            }
        });
    });
}

module.exports = {
    removeSchedule,
};
