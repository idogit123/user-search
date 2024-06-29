"use client"

import { useQuery, useSetQuery } from '@/contexts/QueryContext'
import styles from '@/styles/queryForm.module.css'
import { Query } from '@/types/Query'

export default function PageControl()
{
    const query = useQuery()
    const setQuery = useSetQuery()

    function updatePage(change: number)
    {
        setQuery((oldQuery: Query) => {
            const newPage = (oldQuery.page + change) < 0 ? oldQuery.page : oldQuery.page + change
            return new Query(
                oldQuery.query,
                oldQuery.sort,
                oldQuery.isOrderDescending,
                newPage
            )
        })
    }

    return <div id={styles.pageContainer}>
        <button onClick={() => updatePage(-1)} >{'<'}</button>
        <div>
            <p>{query.page}</p>
        </div>
        <button onClick={() => updatePage(1)}>{'>'}</button>
    </div>
}