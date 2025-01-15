import axios from 'axios';
import { useState } from 'react';
import { Post } from '../types';
import useUser from '../hooks/useUser';

interface CreateRepliesProps {
    post: Post;
    onReply: () => void;
}

export default function CreateReplies({ post, onReply }: CreateRepliesProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const { user } = useUser();

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
            <div className="flex justify-center">
                <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="hover:underline"
                >
                    {showReplies ? 'Hide Comments' : 'Show Comments'}
                </button>
            </div>
            {showReplies && (
                <div>
                    <form className="flex flex-col space-y-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white mt-2" onSubmit={createReplies}>
                        <div className="flex items-center space-x-2 border-b border-b-gray-300 pb-4">
                            <input
                                type="text"
                                placeholder="Insert your reply..."
                                className="flex-grow p-2 bg-white dark:bg-gray-900"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="p-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-700 disabled:opacity-50"
                                disabled={loading}
                            >
                                Submit
                            </button>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                    <div className="mt-4">
                        <h4 className="text-sm mb-2">Respostas</h4>
                        <ul className="space-y-4">
                            {post.replies?.map((reply) => (
                                <li key={reply.id} className="border border-gray-300 rounded-xl p-2">
                                    <p className="font-semibold text-sm">
                                        {reply.author ? reply.author.name.charAt(0).toUpperCase() + reply.author.name.slice(1) : 'Autor desconhecido'}
                                    </p>
                                    <p>{reply.content}</p>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
            )}
        </div>
    );
}