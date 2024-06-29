import QueryForm from '@/components/QueryForm';
import styles from './page.module.css'
import QueryResults from '@/components/QueryResults';
import QueryContextProvider from '@/contexts/QueryContext';

export default function Home(
  { searchParams }: { searchParams: { query: string, sort: string, isDescending: boolean } }
) {

  return <QueryContextProvider>
    <main id={styles.main}>
      <QueryForm  />
      <QueryResults searchParams={searchParams} />
    </main>
  </QueryContextProvider>
}
