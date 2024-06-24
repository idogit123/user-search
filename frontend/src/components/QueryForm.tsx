"use client"

import styles from '@/styles/queryForm.module.css'
import { Query } from '@/types/Query'

export default function QueryForm({ setQuery }: { setQuery: (newValue: Query) => void})
{
    function sendQuery(formData: FormData)
    {
        const query = new Query(
            formData.get('query') as string,
            formData.get('sort') as string
        )

        setQuery(query)
    }   

    return <form id={styles.section} action={ sendQuery } >
        <input id={styles.input} type="text" name="query" placeholder='Search user' />
        <select id={styles.select} name="sort">
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="city">City</option>
        </select>
        <button id={styles.button}>Search</button>
    </form>
}