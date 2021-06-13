const fs = require("fs");
const moment = require('moment');

function schedule(id, name, description, owner_id, pet_id, pet_name, date) {
    return new Promise((resolve, reject) => {
        fs.readFile("schedules.json", (err, data) => {
            if (err) throw err;

            let samedate_count = 0;

            const schedule = JSON.parse(data);

            id = schedule[schedule.length - 1].id + 1;

            if (moment(date).isSameOrBefore(moment().format("YYYY-MM-DD"))) {
                reject("date lower/equal today");
            } else {
                schedule.forEach((schedule) => {
                    if (schedule.owner_id == owner_id && schedule.pet_id == pet_id) {
                        if (moment(date).isSame(moment(schedule.date).format("YYYY-MM-DD"))) {
                            samedate_count += 1; // if the user already has a schedule for the pet in the same day, deny
                        }
                    }
                });

                if (samedate_count >= 1) {
                    reject("samedate");
                } else {
                    const temp_schedule = {};

                    temp_schedule["id"] = id;
                    temp_schedule["name"] = name;
                    temp_schedule["description"] = description;
                    temp_schedule["owner_id"] = owner_id;
                    temp_schedule["pet_id"] = pet_id;
                    temp_schedule["pet_name"] = pet_name;
                    temp_schedule["date"] = date;

                    schedule.push(temp_schedule);

                    fs.writeFile(
                        "schedules.json",
                        JSON.stringify(schedule),
                        (err) => {
                            if (err) throw err;
                            resolve(true);
                        }
                    );
                }
            }
        });
    });
}

module.exports = {
    schedule,
};
