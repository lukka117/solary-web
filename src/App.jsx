import { Routes, Route } from 'react-router-dom';
import SiteLayout from './layout/SiteLayout';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

import { useEffect } from 'react';

export function useScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);
}