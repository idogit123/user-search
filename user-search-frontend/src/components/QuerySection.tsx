"use client"

import styles from '@/styles/querySection.module.css'

export default function QuerySection({ setQuery }: { setQuery: (newValue: string) => void})
{
    return <form id={styles.section} action={ (formData: FormData) => setQuery(formData.get('query') as string) } >
        <input id={styles.input} type="text" name="query" placeholder='Search user' />
        <button id={styles.button}>Search</button>
        <p id={styles.timer}>Completed in: <span>13</span>ms</p>
    </form>
}