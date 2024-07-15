
export class BulkInsertState {
    status: 'pending' | 'success' | 'none'
    duration: number

    constructor()
    {
        this.status = 'none'
        this.duration = 0
    }
}