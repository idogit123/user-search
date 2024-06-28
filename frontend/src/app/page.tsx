"use client";

import QueryForm from '@/components/QueryForm';
import styles from './page.module.css'
import QueryResults from '@/components/QueryResults';
import { useState } from 'react';
import { Query } from '@/types/Query';

export default function Home() {
  const [query, setQuery] = useState(new Query("", "firstName", false, 0))

  return (
    <main id={styles.main}>
      <QueryForm query={query} setQuery={setQuery} />
      <QueryResults query={query} setQuery={setQuery} />
    </main>
  );
}
