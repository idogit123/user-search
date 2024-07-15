"use server";

import EstimateTimer from '@/components/insert-page/EstimateTimer';
import styles from '../page.module.css'
import { useRouter } from 'next/navigation';

export default async function BulkInsertWaitPage()
{
    return <main id={styles.page}>
        <div id={styles.form}>
            <div id={styles.titleContainer}>
                <h2 id={styles.title}>Bulk Insert</h2>
                <p id={styles.timer}>Estimated duration: <EstimateTimer /> seconds.</p>
            </div>
        </div>
    </main>
}