import axios from 'axios';
import { useState } from 'react';
import useAuth from '../utils/auth';
import { Post } from '../types';

interface CreatePostFormProps {
    onPostCreated: (newPost: Post) => void;
}


export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = useAuth();
    const authorId = user?.user?.id;

    const createPost = async (newPost: { content: string }) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/posts', {
                content: newPost.content,
                authorId: authorId
            });
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error('Failed to create post:', error);
            setLoading(false);
            setError('Failed to create post.');
            throw error;
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newPost = { content };
            const createdPost = await createPost(newPost);
            setContent('');
            onPostCreated(createdPost);
        } catch (error) {
            console.error('Failed to create post:', error);
            setError('Failed to create post.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg mt-6  dark:bg-gray-900 text-gray-900 dark:text-white">
            <textarea
                id="content"
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full p-3 border  dark:bg-gray-950 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">{content.length} / 280</span>
                <button 
                    type="submit" 
                    disabled={loading || content.length === 0 || content.length > 280} 
                    className={`px-6 py-2 cursor-pointer text-white font-semibold rounded-full focus:outline-none transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        </form>
    );
}
