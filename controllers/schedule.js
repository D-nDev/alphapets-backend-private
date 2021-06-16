const fs = require("fs");

function schedule(id, description, owner_email, pet_id, pet_name, date) {
    return new Promise((resolve, reject) => {
        fs.readFile("schedules.json", (err, data) => {
            if (err) throw err;

            let samedate_count = 0;

            const schedule = JSON.parse(data);

            if (schedule.length > 0) {
                id = schedule[schedule.length - 1].id + 1;
            }

            schedule.forEach((schedule) => {
                if (
                    schedule.owner_email == owner_email &&
                    schedule.pet_id == pet_id
                ) {
                    if (date == schedule.date) {
                        samedate_count += 1; // if the user already has a schedule for the pet in the same day, deny
                    }
                }
            });

            if (samedate_count >= 1) {
                reject("samedate");
            } else {
                const temp_schedule = {};

                temp_schedule["id"] = id;
                temp_schedule["description"] = description;
                temp_schedule["owner_email"] = owner_email;
                temp_schedule["pet_id"] = pet_id;
                temp_schedule["pet_name"] = pet_name;
                temp_schedule["date"] = date;
                console.log(pet_name);

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
        });
    });
}

module.exports = {
    schedule,
};
