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
                <p id={styles.timer}>Pace: <span>{getDocumentsPerSecond(10_000_000, searchParams.duration)}</span> documents / second.</p>
            </div>
        </div>
    </main>
}

function getDocumentsPerSecond(numberOfDocuments: number, durationInMs: number)
{
    return Math.floor( numberOfDocuments / (durationInMs / 1000) )
}