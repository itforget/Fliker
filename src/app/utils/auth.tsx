import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/api/auth', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setUser(response.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError('Usuário não autenticado');
                } else {
                    setError('Ocorreu um erro ao verificar a autenticação');
                }
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    return { isAuthenticated, user, loading, error };
}
