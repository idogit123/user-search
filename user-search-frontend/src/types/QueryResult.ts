import { User } from "./User"

export class QueryResult
{
    users: User[]
    durationInMs: number

    constructor(users: User[], durationInMs: number)
    {
        this.users = users
        this.durationInMs = durationInMs
    }
}