"use server";

import styles from '../page.module.css'

export default async function BulkInsertResultPage()
{
    const response = await fetch('http://localhost:8080/insert', {
        'cache': 'no-cache'
    })
    const durationInMs = (await response.json()).durationInMs

    return <main id={styles.page}>
        <div id={styles.form}>
            <div id={styles.titleContainer}>
                <h2 id={styles.title}>Bulk Insert</h2>
                <p id={styles.timer}>Completed in: <span>{durationInMs / 1000}</span> seconds.</p>
            </div>
        </div>
    </main>
}