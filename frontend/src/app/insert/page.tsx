"use server";

import FormButton from '@/components/insert-page/FormButton';
import styles from './page.module.css'
import { redirect } from 'next/navigation';

export default async function BulkInsertPage() 
{
    async function bulkInsert() {
        "use server"
        redirect('/insert/result')
    }

    return <main id={styles.page}>
        <form id={styles.form} action={bulkInsert}>
            <div id={styles.titleContainer}>
                <h2 id={styles.title}>Bulk Insert</h2>
                <p id={styles.secondTitle}>Import users from json file to database.</p>
            </div>
            <FormButton label="Insert"/>
        </form>
    </main>
}