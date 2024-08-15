export class User {
    firstName;
    lastName;
    address;
    contact;
    job;
    constructor(args) {
        this.firstName = args.firstName;
        this.lastName = args.lastName;
        this.address = new Address(args.address);
        this.contact = new Contact(args.contact);
        this.job = new Job(args.job);
    }
    getId(counter) {
        return "users/" + (counter).toString().padStart(8, '0');
    }
}
export class Address {
    country;
    city;
    streetAdress;
    zipCode;
    constructor({ country, city, streetAddress, zipCode }) {
        this.country = country;
        this.city = city;
        this.streetAdress = streetAddress;
        this.zipCode = zipCode;
    }
}
export class Contact {
    phone;
    email;
    instegram;
    constructor({ phone, email, instegram }) {
        this.phone = phone;
        this.email = email;
        this.instegram = instegram;
    }
}
export class Job {
    company;
    title;
    type;
    constructor({ company, title, type }) {
        this.company = company;
        this.title = title;
        this.type = type;
    }
}
