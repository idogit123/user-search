import styles from "@/styles/queryForm.module.css"
import { Timer } from "@/types/Timer"

export default function FormInput({ formId }: { formId: string })
{
    const timer = new Timer()

    function submitForm() {
        timer.stop()

        const form = document.getElementById(formId) as HTMLFormElement
        form.requestSubmit()
    }

    return <input id={styles.input} type="search" name="query" placeholder='Search user' onBlur={submitForm} onChange={
        () => timer.start(() =>  submitForm(), 350)
    } />
}