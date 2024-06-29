import styles from '../page.module.css'
import EstimateTimer from '@/components/insert-page/EstimateTimer';

export default function LoadingBulkInsertResultPage()
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