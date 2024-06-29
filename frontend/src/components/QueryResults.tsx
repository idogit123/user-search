"use server"

import styles from '@/styles/queryResults.module.css'
import UserRow from './UserRow'
import { QueryResult } from '@/types/QueryResult'
import ColumnHeader from './ColumnHeader'

export default async function QueryResults(
    { searchParams: { query, sort, isDescending } }: 
    { searchParams: { query: string, sort: string, isDescending: boolean } }
) {
    const response = await fetch(
        `http://localhost:8080/users?query=${query}&sort=${sort}&isDescending=${isDescending}`
    )
    const queryResult = (await response.json()) as QueryResult

    return <>
        <p id={styles.timer}>Completed in: <span>{queryResult.durationInMs}</span>ms</p>
        <table id={styles.table}>
            <tbody>
                <tr>
                    <ColumnHeader column="firstName" >
                        <p>First Name</p> 
                    </ColumnHeader>
                    <ColumnHeader column="lastName" >
                        <p>Last Name</p> 
                    </ColumnHeader>
                    <ColumnHeader column="address.city" >
                        <p>City</p> 
                    </ColumnHeader>
                    <ColumnHeader column="contact.instegram" >
                        <p>Instegram</p>
                    </ColumnHeader>
                    <ColumnHeader column="job.title" >
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