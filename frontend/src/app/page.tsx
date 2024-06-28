import QueryForm from '@/components/home-page/QueryForm';
import styles from './page.module.css'
import QueryResults from '@/components/home-page/QueryResults';
import QueryContextProvider from '@/contexts/QueryContext';

export default function Home(
  { searchParams }: { searchParams: { page: number, query: string, sort: string, isDescending: boolean } }
) {

  return <QueryContextProvider>
    <main id={styles.main}>
      <QueryForm  />
      <QueryResults searchParams={searchParams} />
    </main>
  </QueryContextProvider>
}
