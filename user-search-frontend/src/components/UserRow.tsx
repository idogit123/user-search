

export default function ResultRow(
    { user: {firstName, lastName, city} }: { user: {firstName: string, lastName: string, city: string} }
) {
    return  <tr>
        <td>{firstName}</td>
        <td>{lastName}</td>
        <td>{city}</td>
    </tr>
}