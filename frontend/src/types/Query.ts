export class Query {
    query: string
    sort: string | null
    isOrderDescending: boolean | null

    constructor(query: string, sort: string | null, isOrderDescending: boolean) {
        this.query = query
        this.sort = sort
        this.isOrderDescending = isOrderDescending
    }
}