const { faker } = require('@faker-js/faker');
const fs = require("fs");

function createRandomUser() {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        address: {
            country: faker.location.country(),
            city: faker.location.city(),
            streetAddress: faker.location.streetAddress(),
            zipCode: faker.location.zipCode()
        },
        contact: {
            phone: faker.phone.number(),
            email: faker.internet.email(),
            instegram: faker.internet.userName()
        },
        job: {
            company: faker.company.name(),
            title: faker.person.jobTitle(),
            type: faker.person.jobType()
        }
    };
}

const writeStream = fs.createWriteStream('users.jsonl', { flags: 'w' });

for (let i = 0; i < 1_000_000; i++) {
    const user = createRandomUser();
    writeStream.write(JSON.stringify(user)); 
    writeStream.write('\n')

    if(i%100_000 == 0){
        console.log(i);
    }
}

// Close the stream when done
writeStream.end(() => {
    console.log('Users written to users.jsonl');
});

writeStream.on('error', (error) => {
    console.log(error)
})
