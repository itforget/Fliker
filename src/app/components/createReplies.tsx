import axios from 'axios';
import { useState } from 'react';
import { Post } from '../types';
import useAuth from '../utils/auth';

interface CreateRepliesProps {
    post: Post;
    onReply: () => void;
}

export default function CreateReplies({ post, onReply }: CreateRepliesProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState('');

    const createReplies = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/replies', {
                content,
                authorId: user?.id, 
                postId: post.id
            });
            setLoading(false);
            setContent(''); 
            onReply();
            return response.data;
        } catch (error) {
            console.error('Failed to create reply:', error);
            setLoading(false);
            setError('Failed to create reply.');
            throw error; 
        }
    };

    return (
        <div className="container mx-auto p-4">
            <form className="flex flex-col space-y-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white mt-2" onSubmit={createReplies}>
            <div className="flex items-center space-x-2">
                <input 
                type="text" 
                placeholder="Insert your reply..." 
                className="flex-grow p-2 border dark:bg-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                />
                <button 
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" 
                disabled={loading}
                >
                Submit
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}