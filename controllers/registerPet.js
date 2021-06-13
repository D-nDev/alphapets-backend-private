const fs = require("fs");

function registerPet(id, name, age, weight, breed, type, owner_id, photo) {
    return new Promise((resolve, reject) => {
        fs.readFile("pets.json", (err, data) => {
            if (err) throw err;

            let pets = JSON.parse(data);
            if (pets.length > 0) {
                id = pets[pets.length - 1].id + 1;
            }

            let soma = 0;

            pets.forEach(pet => {
                if(pet.name == name && pet.type == type && pet.owner_id == owner_id) {
                    soma += 1;
                }
            })

            if (soma >= 1) {
                reject(false);
            } else {
                const temp_pet = {};

                temp_pet["id"] = id;
                temp_pet["name"] = name;
                temp_pet["age"] = age;
                temp_pet["weight"] = weight;
                temp_pet["breed"] = breed;
                temp_pet["type"] = type;
                temp_pet["owner_id"] = owner_id;
                temp_pet["photo"] = photo;

                pets.push(temp_pet);

                fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
                    if (err) throw err;
                    resolve(true);
                });
            }
        });
    });
}

module.exports = {
    registerPet,
};
