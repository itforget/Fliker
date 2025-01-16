import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../types';
import UseUser from '../hooks/useUser';
import { CreateComment } from '../hooks/createComments'; 

interface CreateCommentsProps {
    post: Post;
    onComment: () => void;
}

export default function CreateComments({ post, onComment }: CreateCommentsProps) {
    const [content, setContent] = useState('');
    const [showComments, setShowComments] = useState(false);
    const queryClient = useQueryClient();
    const { user } = UseUser();

    const mutation = useMutation({
        mutationFn: CreateComment, 
        onSuccess: (newComment) => {
            queryClient.invalidateQueries({ queryKey: ['Comments', post.id] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            onComment(); 
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

    const sortedComments = post.comments?.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) || [];

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="hover:underline"
                >
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
            </div>
            {showComments && (
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
                            {sortedComments.map((comment) => (
                                <li key={comment.id} className="border border-gray-300 rounded-xl p-2">
                                    <p className="font-semibold text-sm">
                                        {comment.author ? comment.author.name.charAt(0).toUpperCase() + comment.author.name.slice(1) : 'Autor desconhecido'}
                                    </p>
                                    <p>{comment.content}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}