import { Query } from "@/types/Query"


export default function SortButton({ column, setQuery }: { column: string, setQuery: Function })
{
    function updateSort() {
        setQuery(
            (oldQuery: Query) => new Query(oldQuery.query, column)
        )
    }

    return <button onClick={updateSort}>Sort</button>
}