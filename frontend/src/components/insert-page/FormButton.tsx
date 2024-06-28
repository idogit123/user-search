"use client";

import { useFormStatus } from "react-dom";
import styles from '@/styles/formButton.module.css'

export default function FormButton({ label }: { label: string })
{
    const { pending: isPending } = useFormStatus()

    return <button className={styles.button} disabled={isPending}>
        {isPending ? <div className={styles.loader}></div> : label}
    </button>
}