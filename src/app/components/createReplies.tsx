import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../types';
import UseUser from '../hooks/useUser';
import { CreateReply } from '../hooks/createReply'; 

interface CreateRepliesProps {
    post: Post;
    onReply: () => void;
}

export default function CreateReplies({ post, onReply }: CreateRepliesProps) {
    const [content, setContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const queryClient = useQueryClient();
    const { user } = UseUser();

    const mutation = useMutation({
        mutationFn: CreateReply, 
        onSuccess: (newReply) => {
            queryClient.invalidateQueries({ queryKey: ['replies', post.id] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            onReply(); 
            setContent(''); 
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (content.trim().length > 0 && post.id !== undefined) {
            mutation.mutate({
                content,
                authorId: user?.id,
                postId: post.id,
            });
        }
    };

    const sortedReplies = post.replies?.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) || [];

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
                    <form className="flex flex-col space-y-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white mt-2" onSubmit={handleSubmit}>
                        <div className="flex items-center space-x-2 border-b border-b-gray-300 pb-4">
                            <input
                                type="text"
                                placeholder="Insert your Comment here..."
                                className="flex-grow p-2 bg-white dark:bg-gray-900"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="p-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-700 disabled:opacity-50"
                                disabled={mutation.isPending || content.length === 0}
                            >
                                {mutation.isPending ? 'Posting...' : 'Submit'}
                            </button>
                        </div>
                        {mutation.isError && <p className="text-red-500">{mutation.error?.message}</p>}
                    </form>
                    <div className="mt-4">
                        <h4 className="text-sm mb-2">Respostas</h4>
                        <ul className="space-y-4">
                            {sortedReplies.map((reply) => (
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
