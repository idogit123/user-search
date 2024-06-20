import styles from '@/styles/querySection.module.css'

async function testApi(formData: FormData) {
    "use server";
    
    const response = await fetch(
        "http://localhost:8080/test"
    )

    console.log(await response.json())
}

export default function QuerySection()
{
    return <form id={styles.section} action={testApi} >
        <input id={styles.input} type="text" name="query" placeholder='Search user' />
        <button id={styles.button}>Search</button>
        <p id={styles.timer}>Completed in: <span>13</span>ms</p>
    </form>
}