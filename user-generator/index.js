import { faker } from '@faker-js/faker'
import { createWriteStream } from 'fs'

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

function createUsersJson(jsonPath, usersAmount)
{
    const writeStream = createWriteStream(jsonPath, { flags: 'w' });

    for (let i = 0; i < usersAmount; i++) {
        const user = createRandomUser();
        writeStream.write(JSON.stringify(user));
        writeStream.write('\n')

        if(i % (usersAmount / 100) == 0){
            console.log('progress: ', parseInt(i/usersAmount * 100), '%')
        }
    }

    // Close the stream when done
    writeStream.end(() => {
        console.log('Users written to users.jsonl');
    })

    writeStream.on('close', () => {
        console.log('stream closed')
    })

    writeStream.on('error', (error) => {
        console.log(error)
    })
}

createUsersJson('users.jsonl', 2_000_000)