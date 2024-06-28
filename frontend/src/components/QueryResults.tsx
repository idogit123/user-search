import styles from '@/styles/queryResults.module.css'
import UserRow from './UserRow'
import { useEffect, useState } from 'react'
import { QueryResult } from '@/types/QueryResult'
import { Query } from '@/types/Query'
import ColumnHeader from './ColumnHeader'

export default function QueryResults(
    { query, setQuery }: { query: Query, setQuery: Function }
) {
    const [queryResult, setQueryResult] = useState<QueryResult>()

    async function getUsers() {
        const response = await fetch(
            `http://localhost:8080/users/${query.page}?query=${query.query}&sort=${query.sort}&isDescending=${query.isOrderDescending}`
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
        <p id={styles.timer}>Completed in: <span>{queryResult?.durationInMs}</span>ms</p>
        <table id={styles.table}>
            <tbody>
                <tr>
                    <ColumnHeader column="firstName" setQuery={setQuery} query={query}>
                        <p>First Name</p> 
                    </ColumnHeader>
                    <ColumnHeader column="lastName" setQuery={setQuery} query={query}>
                        <p>Last Name</p> 
                    </ColumnHeader>
                    <ColumnHeader column="address.city" setQuery={setQuery} query={query}>
                        <p>City</p> 
                    </ColumnHeader>
                    <ColumnHeader column="contact.instegram" setQuery={setQuery} query={query}>
                        <p>Instegram</p>
                    </ColumnHeader>
                    <ColumnHeader column="job.title" setQuery={setQuery} query={query}>
                        <p>Job Title</p>
                    </ColumnHeader>
                </tr>
                {
                queryResult == null ? '' :
                queryResult?.users.map(
                    (user, index) => <UserRow user={user} key={index} />
                )}
            </tbody>
        </table>
    </>
    
}