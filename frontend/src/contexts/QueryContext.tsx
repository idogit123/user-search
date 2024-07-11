"use client"

import { Query } from "@/types/Query"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react"

const QueryContext = createContext<any>(null)
const SetQueryContext = createContext<any>(null)

export function useQuery(): Query {
    return useContext(QueryContext)
}

export function useSetQuery(): Dispatch<SetStateAction<Query>> {
    return useContext(SetQueryContext)
}

export default function QueryContextProvider({ children }: { children: JSX.Element | JSX.Element[] })
{
    const [query, setQuery] = useState(new Query("", "firstName", false, 0))
    const router = useRouter()

    useEffect(() => {
        router.replace(
            `?page=${query.page}&query=${query.query}&sort=${query.sort}&isDescending=${query.isOrderDescending}`
        )
    }, [query])

    return <QueryContext.Provider value={query}>
        <SetQueryContext.Provider value={setQuery}>
            {children}
        </SetQueryContext.Provider>
    </QueryContext.Provider>
}