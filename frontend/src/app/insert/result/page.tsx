"use server";

import styles from '../page.module.css'

export default async function BulkInsertResultPage(
    { searchParams }: { searchParams: { duration: number } }
)
{
    return <main id={styles.page}>
        <div id={styles.form}>
            <div id={styles.titleContainer}>
                <h2 id={styles.title}>Bulk Insert</h2>
                <p id={styles.timer}>Completed in: <span>{searchParams.duration / 1000}</span> seconds.</p>
            </div>
        </div>
    </main>
}