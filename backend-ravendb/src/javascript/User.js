export class User {
    id;
    firstName;
    lastName;
    addressId;
    contactId;
    jobId;
    constructor(firstName, lastName, addressId, contactId, jobId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.addressId = addressId;
        this.contactId = contactId;
        this.jobId = jobId;
        this.id = User.createUserId(firstName, lastName);
    }
    static createUserId(firstName, lastName) {
        return (firstName + '-' + lastName).toLowerCase().replaceAll(' ', '-');
    }
}
export class Address {
    id;
    country;
    city;
    streetAdress;
    zipCode;
    constructor({ country, city, streetAddress, zipCode }) {
        this.country = country;
        this.city = city;
        this.streetAdress = streetAddress;
        this.zipCode = zipCode;
        this.id = this.createAddressId(country, zipCode);
    }
    createAddressId(country, zipCode) {
        return (country.split(' ')[0] + '-' + zipCode).replaceAll(' ', '').toLowerCase();
    }
}
export class Contact {
    id;
    phone;
    email;
    instegram;
    constructor({ phone, email, instegram }) {
        this.phone = phone;
        this.email = email;
        this.instegram = instegram;
        this.id = this.createContactId(email, phone);
    }
    createContactId(email, phone) {
        return (email.split('@')[0] + '-' + phone.slice(phone.length - 2)).replaceAll(' ', '').toLowerCase();
    }
}
export class Job {
    id;
    company;
    title;
    type;
    constructor({ company, title, type }) {
        this.company = company;
        this.title = title;
        this.type = type;
        this.id = this.createJobId(company, title);
    }
    createJobId(company, title) {
        return (company.split(' ')[0] + '-' + title.split(' ')[0]).replaceAll(' ', '').toLowerCase();
    }
}
