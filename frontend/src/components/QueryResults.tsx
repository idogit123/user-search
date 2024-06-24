import styles from '@/styles/queryResults.module.css'
import UserRow from './UserRow'
import { useEffect, useState } from 'react'
import { QueryResult } from '@/types/QueryResult'

async function getUsers(query: string, setQueryResult: (queryResult: QueryResult) => void) {
  const response = await fetch(
    `http://localhost:8080/users?query=${query}`
  )

  const queryResult = (await response.json()) as QueryResult

  setQueryResult( queryResult )
}

export default function QueryResults(
    { query }: { query: string }
) {
    const [queryResult, setQueryResult] = useState<QueryResult>()

    useEffect(
        () => {
            if (query.length > 0)
                getUsers(query, (queryResult) => setQueryResult(queryResult))
        },
        [query]
    )

    return <>
        <table id={styles.table}>
            <tbody>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>City</th>
                </tr>
                {
                queryResult == null ? '' :
                queryResult?.users.map(
                    (user, index) => <UserRow user={user} key={index} />
                )}
            </tbody>
        </table>
        <p id={styles.timer}>Completed in: <span>{queryResult?.durationInMs}</span>ms</p>
    </>
    
}