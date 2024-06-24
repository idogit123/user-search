import styles from '@/styles/queryResults.module.css'
import UserRow from './UserRow'
import { useEffect, useState } from 'react'
import { QueryResult } from '@/types/QueryResult'
import { Query } from '@/types/Query'
import SortButton from './SortButton'

export default function QueryResults(
    { query, setQuery }: { query: Query, setQuery: Function }
) {
    const [queryResult, setQueryResult] = useState<QueryResult>()

    async function getUsers() {
        const response = await fetch(
            `http://localhost:8080/users?query=${query.query}&sort=${query.sort}`
        )
        
        const queryResult = (await response.json()) as QueryResult
        
        setQueryResult( queryResult )
    }

    useEffect(
        () => {
            getUsers()
        },
        [query]
    )

    return <>
        <table id={styles.table}>
            <tbody>
                <tr>
                    <th>
                        <p>First Name</p> 
                        <SortButton column="firstName" setQuery={setQuery}/> 
                    </th>
                    <th>
                        <p>Last Name</p> 
                        <SortButton column="lastName" setQuery={setQuery}/> 
                    </th>
                    <th>
                        <p>City</p>
                        <SortButton column="city" setQuery={setQuery}/> 
                    </th>
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