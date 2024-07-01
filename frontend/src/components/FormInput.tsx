"use client"

import { useSetQuery } from "@/contexts/QueryContext"
import styles from "@/styles/queryForm.module.css"
import { Query } from "@/types/Query"
import { Timer } from "@/types/Timer"

export default function FormInput()
{
    const timer = new Timer()
    const setQuery = useSetQuery()

    function updateQuery() {
        timer.stop()

        const newQuery = (document.getElementById(styles.input) as HTMLInputElement).value
        setQuery((oldQuery: Query) => new Query(
            newQuery,
            oldQuery.sort,
            oldQuery.isOrderDescending
        ))
    }

    return <input id={styles.input} type="search" placeholder='Search user' onBlur={updateQuery} autoComplete="off" onChange={
        () => timer.start(updateQuery, 350)
    } />
}