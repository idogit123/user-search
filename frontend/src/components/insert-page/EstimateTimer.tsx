"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EstimateTimer()
{
    // mandatory for helping next.js identify this component as client.
    try { document }
    catch (error) {}

    const [timer, setTimer] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const timeout = setInterval(async () => {
            setTimer((oldTimer) => oldTimer + 1)

            const state = await getInsertState()
            if (state.status == 'success')
                router.replace(`/insert/result?duration=${state.duration}`)

        }, 1000)

        return () => clearInterval(timeout)
    }, [])
    
    return <span>
        {timer}
    </span>
}

async function getInsertState(): Promise<{ status: 'none' | 'pending' | 'success', duration: number }>
{
    const response = await fetch('http://localhost:8080/insert/status', {
        'cache': 'no-cache'
    })
    return await response.json() 
}