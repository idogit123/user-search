"use server";

import FormButton from '@/components/FormButton';
import styles from './page.module.css'
import { redirect } from 'next/navigation';

async function insertUsersToDatabase() {
    "use server";

    const response = await fetch('http://localhost:8080/insert')
    const durationInMs = (await response.json()).durationInMs

    redirect(`http://localhost:3000/insert?duration=${durationInMs}`)
}

export default async function BulkInsertPage(
    { searchParams: { duration } }: { searchParams: { duration: number | undefined } }
) {
    return <main id={styles.page}>
        <form id={styles.form} action={insertUsersToDatabase}>
            <div id={styles.titleContainer}>
                <h2 id={styles.title}>Bulk Insert</h2>
                <p id={styles.secondTitle}>Import users from json file to database.</p>
                <p id={styles.timer}>Completed in: <span>{duration}</span>ms</p>
            </div>
            <FormButton label="Insert"/>
        </form>
    </main>
}