"use client"

import styles from '@/styles/queryForm.module.css'
import { Query } from '@/types/Query'
import { FormEvent } from 'react'
import FormInput from './FormInput'

export default function QueryForm({ setQuery }: { setQuery: Function})
{

    function sendQuery(submitEvent: FormEvent<HTMLFormElement>)
    {
        submitEvent.preventDefault()

        const formData = new FormData(submitEvent.currentTarget)
        const newQuery = formData.get('query') as string | null

        setQuery((oldQuery: Query) => new Query(
            newQuery == null || newQuery.length == 0 ? "" : newQuery, 
            oldQuery.sort, 
            oldQuery.isOrderDescending
        ))
    }

    return <form id={styles.form} onSubmit={ sendQuery } >
        <FormInput formId={styles.form}/>
    </form>
}