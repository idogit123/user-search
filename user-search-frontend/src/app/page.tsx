"use client";

import QuerySection from '@/components/QuerySection';
import styles from './page.module.css'
import SearchResults from '@/components/SearchResults';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState("")

  return (
    <main id={styles.main}>
      <QuerySection setQuery={(newValue: string) => setQuery(newValue)} />
      <SearchResults query={query} />
    </main>
  );
}
