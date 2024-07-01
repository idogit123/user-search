"use client"

import { useQuery, useSetQuery } from "@/contexts/QueryContext"
import { Query } from "@/types/Query"

export default function ColumnHeader(
    { column, children }: { column: string, children: JSX.Element }
) {
    const query = useQuery()
    const setQuery = useSetQuery()
    const sortOrder: "down" | "up" | "none" = getSortOrder()

    function getSortOrder() {
        if (query.sort != column)
            return "none"

        if (query.isOrderDescending)
            return "down"
        else
            return "up"
    }

    function updateSort() {
        setQuery(
            (oldQuery: Query) => {
                if (oldQuery.sort == column)
                    return new Query(oldQuery.query, oldQuery.sort, !oldQuery.isOrderDescending) // flip order
                else 
                    return new Query(oldQuery.query, column, false) // change sorting column
            }
        )
    }

    return <th onClick={updateSort} data-sort={sortOrder}>
        {children}
    </th>
}