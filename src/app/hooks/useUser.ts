import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';

export default function UseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/user`, {
          withCredentials: true, 
        });

        if (response.data.error) {
          setError(response.data.error);
          setUser(null);
        } else {
          setUser(response.data.user);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []); 

  return { user, loading, error };
}
