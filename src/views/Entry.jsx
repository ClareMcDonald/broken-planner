import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEntries } from '../context/PlannerContext';

import styles from './Entry.css';

export default function Entry() {
  const { id } = useParams();
  const [entry, setEntry] = useState({});
  const { entries, getEntry, updateEntry } = useEntries();
  const [isEditing, setIsEditing] = useState(false);

  let content;

  useEffect(() => {
    setEntry(getEntry(id));
  }, [id, entries.length]);

  if (isEditing) {
    content = (
      <form onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Plan something"
          value={entry.title}
          onChange={(e) => updateEntry({ ...entry, title: e.target.value })}
          className={styles.input}
        />
        {/* <input
          type="date"
          name="date"
          aria-label="Due date"
          value={entry.date || ''}
          onChange={(e) => updateEntry({ ...entry, date: e.target.value })}
          className={styles.input}
        /> */}
        <textarea
          name="content"
          placeholder="A brief description of what you're planning"
          value={entry.content}
          onChange={(e) => updateEntry({ ...entry, content: e.target.value })}
          className={styles.content}
        />
        <button type="submit edits">Save Edits</button>
      </form>
    )
  } else {
    content = (
      <button type='button' aria-label='edit button' onClick={() => setIsEditing(true)}>Edit</button>
    )
  }

  return (
    <>
      <Link to="/entries" className={styles.backButton}>
        &laquo; Back to Planner
      </Link>
      <article className={styles.entry}>
        <h1>{entry?.title}</h1>
        <p>Due: {entry?.date}</p>
        <p>{entry?.content}</p>
      </article>
      {content} 
    </>
  );
}
