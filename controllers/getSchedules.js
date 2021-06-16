const fs = require('fs');

function getSchedules(email) {
    return new Promise((resolve, reject) => {
        fs.readFile("schedules.json", (err, data) => {
            if (err) throw err;

            const schedules = JSON.parse(data);
            let userschedules = [];

            schedules.forEach(schedule => {
                if(schedule.owner_email == email) {
                    userschedules.push(schedule)
                }
            })

            resolve(userschedules);
        });
    });
}

module.exports = {
    getSchedules,
}
