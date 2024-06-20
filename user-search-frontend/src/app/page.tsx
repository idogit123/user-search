import styles from './page.module.css'

export default function Home() {
  return (
    <main id={styles.main}>
      <section id={styles.querySection}>
        <input id={styles.queryInput} type="text" name="query" placeholder='Search user' />
        <button id={styles.queryButton}>Search</button>
        <p id={styles.queryTimer}>Completed in: <span>13</span>ms</p>
      </section>
    </main>
  );
}
