export class User {
    id: string
    firstName: string
    lastName: string
    addressId: string
    contactId: string
    jobId: string

    constructor(
        firstName: string,
        lastName: string,
        addressId: string,
        contactId: string,
        jobId: string
    ) {
        this.firstName = firstName
        this.lastName = lastName
        this.addressId = addressId
        this.contactId = contactId
        this.jobId = jobId
        this.id = User.createUserId(firstName, lastName)
    }

    static createUserId(firstName: string, lastName: string)
    {
        return (firstName + '-' + lastName).toLowerCase().replaceAll(' ', '-')
    }
}

export class Address 
{
    id: string
    country: string
    city: string
    streetAdress: string
    zipCode: string

    constructor({
        country,
        city,
        streetAddress,
        zipCode
    }: {
        country: string,
        city: string,
        streetAddress: string,
        zipCode: string
    }) {
        this.country = country
        this.city = city
        this.streetAdress = streetAddress
        this.zipCode = zipCode
        this.id = this.createAddressId(country, zipCode)
    }

    createAddressId(country: string, zipCode: string)
    {
        return (country.split(' ')[0] + '-' + zipCode).replaceAll(' ', '').toLowerCase()
    }
}

export class Contact 
{
    id: string
    phone: string
    email: string
    instegram: string

    constructor({
        phone,
        email,
        instegram
    } : {
        phone: string,
        email: string,
        instegram: string
    }) {
        this.phone = phone
        this.email = email
        this.instegram = instegram
        this.id = this.createContactId(email, phone)
    }

    createContactId(email: string, phone: string)
    {
        return (email.split('@')[0] + '-' + phone.slice(phone.length-2)).replaceAll(' ', '').toLowerCase()
    }
}

export class Job 
{
    id: string
    company: string
    title: string
    type: string

    constructor({
        company,
        title,
        type
    } : {
        company: string,
        title: string,
        type: string
    }) {
        this.company = company
        this.title = title
        this.type = type
        this.id = this.createJobId(company, title)
    }

    createJobId(company: string, title: string)
    {
        return (company.split(' ')[0] + '-' + title.split(' ')[0]).replaceAll(' ', '').toLowerCase()
    }
}