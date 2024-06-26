const { faker } = require('@faker-js/faker');
const fs = require("fs");

function createRandomUser() {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
        address: {
            city: faker.location.city()
        },
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName()
    };
}

const writeStream = fs.createWriteStream('users.jsonl', { flags: 'w' });

for (let i = 0; i < 10_000_000; i++) {
    const user = createRandomUser();
    writeStream.write(JSON.stringify(user)); 
    writeStream.write('\n')

    if(i%100_000 == 0){
        console.log(i);
    }
}

// Close the stream when done
writeStream.end();

writeStream.on('finish', () => {
    console.log('Users written to users.jsonl');
});
