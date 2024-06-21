"use client";

import QuerySection from '@/components/QuerySection';
import styles from './page.module.css'
import QueryResults from '@/components/QueryResults';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState("")

  return (
    <main id={styles.main}>
      <QuerySection setQuery={(newValue: string) => setQuery(newValue)} />
      <QueryResults query={query} />
    </main>
  );
}
