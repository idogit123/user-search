import { User } from "@/types/User"

export default function ResultRow(
    { 
        user
    } : { 
        user: User
    }
) {
    return  <tr>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.address.city}</td>
        <td>{user.contact.instegram}</td>
        <td>{user.job.title}</td>
    </tr>
}