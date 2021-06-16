const fs = require('fs');

function getPets(email) {
    return new Promise((resolve, reject) => {
        fs.readFile("pets.json", (err, data) => {
            if (err) throw err;

            const pets = JSON.parse(data);
            let userpets = [];
            //console.log(email);
            //console.log(pets);

            pets.forEach(pet => {
                if(pet.owner_email == email) {
                    //console.log("entrei aqui")
                    userpets.push(pet)
                }
            })

            //console.log(userpets);
            resolve(userpets);
        });
    });
}

module.exports = {
    getPets,
}
