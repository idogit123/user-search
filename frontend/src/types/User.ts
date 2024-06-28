export class User {
    firstName: string
    lastName: string
    address: Address
    contact: Contact
    job: Job

    constructor(args: any) {
        this.firstName = args.firstName
        this.lastName = args.lastName
        this.address = new Address(args.address)
        this.contact = new Contact(args.contact)
        this.job = new Job(args.job)
    }
}

export class Address 
{
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
    }
}

export class Contact 
{
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
    }
}

export class Job 
{
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
    }
}