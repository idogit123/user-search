import styles from '@/styles/querySection.module.css'

export default function QuerySection()
{
    return <section id={styles.section}>
        <input id={styles.input} type="text" name="query" placeholder='Search user' />
        <button id={styles.button}>Search</button>
        <p id={styles.timer}>Completed in: <span>13</span>ms</p>
    </section>
}