import styles from '@/styles/queryForm.module.css'
import FormInput from './FormInput'
import PageControl from './PageControl'

export default function QueryForm()
{
    return <div id={styles.form} >
        <FormInput />
        <PageControl />
    </div>
}