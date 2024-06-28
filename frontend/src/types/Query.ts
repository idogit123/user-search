export class Query {
    query: string
    sort: string | null
    isOrderDescending: boolean
    page: number

    constructor(query: string, sort: string | null, isOrderDescending: boolean, page: number) {
        this.query = query
        this.sort = sort
        this.isOrderDescending = isOrderDescending
        this.page = page
    }
}