export class Query {
    query: string
    sort: string | null

    constructor(query: string, sort: string | null) {
        this.query = query
        this.sort = sort
    }
}