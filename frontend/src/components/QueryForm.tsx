"use client"

import styles from '@/styles/queryForm.module.css'

export default function QuerySection({ setQuery }: { setQuery: (newValue: string) => void})
{
    return <form id={styles.section} action={ (formData: FormData) => setQuery(formData.get('query') as string) } >
        <input id={styles.input} type="text" name="query" placeholder='Search user' />
        <button id={styles.button}>Search</button>
    </form>
}