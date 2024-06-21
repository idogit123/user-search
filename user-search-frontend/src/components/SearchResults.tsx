import styles from '@/styles/searchResults.module.css'
import UserRow from './UserRow'
import { useEffect, useState } from 'react'
import { User } from '@/types/User'

async function getUsers(query: string, setUsers: (users: User[]) => void) {
  const response = await fetch(
    `http://localhost:8080/users?query=${query}`
  )

  const users = (await response.json()) as User[]

  setUsers( users )
}

export default function SearchResults(
    { query }: { query: string }
) {
    const [users, setUsers] = useState<User[]>([])

    useEffect(
        () => {
            if (query.length > 0)
                getUsers(query, (users) => setUsers(users))
        },
        [query]
    )

    return <table id={styles.table}>
        <tbody>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
            </tr>
            {users.map(
                (user) => <UserRow user={user} />
            )}
        </tbody>
    </table>
}