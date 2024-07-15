"use server";

import styles from '../page.module.css'

export default async function BulkInsertResultPage()
{
    const durationInMs = await new Promise<number>(async (resolve, reject) => {
        try {
            const response = await fetch('http://localhost:8080/insert', {
                'cache': 'no-cache'
            })
            resolve((await response.json()).durationInMs)
        }
        catch (error: unknown) {
            console.log( error )
        }   
    })
    
    

    return <main id={styles.page}>
        <div id={styles.form}>
            <div id={styles.titleContainer}>
                <h2 id={styles.title}>Bulk Insert</h2>
                <p id={styles.timer}>Completed in: <span>{durationInMs / 1000}</span> seconds.</p>
            </div>
        </div>
    </main>
}