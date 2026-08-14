import { useState, useEffect } from 'react';
import { fetchGithubData } from '../lib/github';

export const useGithubReadme = () => {
  const [data, setData] = useState({ projects: [], certificates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        const result = await fetchGithubData();
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return { ...data, loading, error };
};
