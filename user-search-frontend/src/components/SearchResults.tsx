import styles from '@/styles/searchResults.module.css'

export default function SearchResults()
{
    return <table id={styles.table}>
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
        </tr>
        <tr>
            <td>Ido</td>
            <td>Vitman Zilber</td>
            <td>Binyamina</td>
        </tr>
    </table>
}