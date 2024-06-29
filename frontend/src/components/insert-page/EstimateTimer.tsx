"use client";

import { useEffect, useState } from "react";

export default function EstimateTimer()
{
    // mandatory for helping next.js identify this component as client.
    try { document }
    catch (error) {}

    const [timer, setTimer] = useState(0)

    useEffect(() => {
        const timeout = setInterval(() => {
            setTimer((oldTimer) => oldTimer + 1)
        }, 1000)

        return () => clearInterval(timeout)
    }, [])
    
    return <span>
        {timer}
    </span>
}