import axios from 'axios';
import { useState } from 'react';
import { Post } from '../types';
import { Heart, Spinner } from '@phosphor-icons/react';
import useAuth from '../utils/auth';
interface GiveLikeProps {
    post: Post;
    onLike: () => void;
}

export default function GiveLike({ post, onLike }: GiveLikeProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const giveLike = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/likes', {
                userId: user?.id, 
                postId: post.id
            });
            setLoading(false);
            onLike();
            return response.data;
        } catch (error) {
            console.error('Failed to give like:', error);
            setLoading(false);
            setError('Failed to give like.');
            throw error; 
        }
    };

    return (
        <div className='flex flex-row items-center gap-2'>
            <button 
            onClick={giveLike} 
            disabled={loading} 
            className={`transition-transform duration-300 ${loading ? 'scale-95' : 'hover:scale-110'}`}
            >
            {loading ? <Spinner className='animate-spin' size={24} /> : <p className='flex flex-row items-center gap-1'><Heart className='text-red-500' size={24} /> {Array.isArray(post.likes) ? post.likes.length : 0}</p>}
            </button>
            <div>
            {error && <p className='text-red-500'>{error}</p>}
            </div>
        </div>
    );
}