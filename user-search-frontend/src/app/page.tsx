import QuerySection from '@/components/QuerySection';
import styles from './page.module.css'
import SearchResults from '@/components/SearchResults';

export default function Home() {
  return (
    <main id={styles.main}>
      <QuerySection />
      <SearchResults />
    </main>
  );
}
