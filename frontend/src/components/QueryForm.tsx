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
        const queryValue = formData.get('query') as string | null
        const query = new Query(
            queryValue == null || queryValue.length == 0 ? "" : queryValue,
            null
        )

        setQuery(query)
    }

    return <form id={styles.form} onSubmit={ sendQuery } >
        <FormInput formId={styles.form}/>
    </form>
}