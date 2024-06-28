"use client"

import styles from '@/styles/queryForm.module.css'
import { Query } from '@/types/Query'
import { FormEvent } from 'react'
import FormInput from './FormInput'

export default function QueryForm({ query, setQuery }: { query: Query, setQuery: Function})
{

    function sendQuery(submitEvent: FormEvent<HTMLFormElement>)
    {
        submitEvent.preventDefault()

        const formData = new FormData(submitEvent.currentTarget)
        const newQuery = formData.get('query') as string | null

        setQuery((oldQuery: Query) => new Query(
            newQuery == null || newQuery.length == 0 ? "" : newQuery, 
            oldQuery.sort, 
            oldQuery.isOrderDescending,
            oldQuery.page
        ))
    }

    function updatePage(change: number)
    {
        setQuery((oldQuery: Query) => {
            const newPage = (oldQuery.page + change) < 0 ? oldQuery.page : oldQuery.page + change
            oldQuery.page = newPage
            return oldQuery
        })
    }

    return <form id={styles.form} onSubmit={ sendQuery } >
        <FormInput formId={styles.form}/>
        <div id={styles.pageContainer}>
            <button onClick={() => updatePage(-1)} >{'<'}</button>
            <p>{query.page}</p>
            <button onClick={() => updatePage(1)}>{'>'}</button>
        </div>
    </form>
}