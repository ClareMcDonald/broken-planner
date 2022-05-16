import { createContext, useContext, useEffect, useReducer } from 'react';
import { parseDate } from '../utils/parseDate';

// payload is an entry object:
// { title: String, content: String, date: Date }
function entriesReducer(entries, { type, payload }) {
  switch (type) {
    case 'create':
      const entry = { ...payload, id: entries.length };
      return [entry, ...entries];
    case 'reset':
      return [...payload];
    case 'update':
      return entries.map((entry) => {
        const { title, content } = payload.entry
        return entry.id === payload.entry.id ? { ...payload.entry, title, content } : entry
      }
        
      );
    case 'delete':
      return entries.filter((entry) => entry.id !== payload.id);
    default:
      throw Error(`Unknown action: ${type}`);
  }
}

export const PlannerContext = createContext();

const PlannerProvider = ({ children }) => {
  const [entries, dispatch] = useReducer(entriesReducer, []);

  useEffect(() => {
    // Note that 'entries' below would likely be an API request in practice
    const entries = [
      {
        id: 0,
        title: 'Start Planning',
        content: 'I should write in my planner',
        date: parseDate(new Date()),
      },
    ];
    dispatch({
      type: 'reset',
      payload: entries,
    });
  }, []);

  const addEntry = (entry) => {
    const payload = {
      ...entry,
      date: parseDate(entry.date),
    };
    dispatch({ type: 'create', payload });
    return payload;
  };

  const getEntry = (id) => {
    return entries.find((note) => note.id === Number(id));
  };

  const updateEntry = (entry) => {
    console.log(entry);
    dispatch({ type: 'update', payload: { entry } })
    return entry;

  };

  const deleteEntry = (id) => {
    dispatch({ type: 'delete', payload: { id } })
  }

  return (
    <PlannerContext.Provider
      value={{
        entries,
        addEntry,
        getEntry,
        updateEntry,
        deleteEntry
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

const useEntries = () => {
  const context = useContext(PlannerContext);

  if (context === undefined) {
    throw new Error('useEntries must be used within a PlannerProvider');
  }

  return context;
};

export { PlannerProvider, useEntries };
