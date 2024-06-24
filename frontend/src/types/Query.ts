export class Query {
    query: string
    sort: string

    constructor(query: string, sort: string) {
        this.query = query
        this.sort = sort
    }
}