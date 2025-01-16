import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../types';
import UseUser from '../hooks/useUser';
import { CreatePost } from '../hooks/createPostMutation';

interface CreatePostFormProps {
    onPostCreated: (newPost: Post) => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();
    const { user } = UseUser();

    const mutation = useMutation({
        mutationFn: CreatePost,
        onSuccess: (newPost) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            onPostCreated(newPost);
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (content.trim().length > 0 && content.trim().length <= 280) {
            mutation.mutate({ content, authorId: user?.id }); 
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg mt-6 dark:bg-gray-900 text-gray-900 dark:text-white"
        >
            <textarea
                id="content"
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full p-3 border dark:bg-gray-950 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">{content.length} / 280</span>
                <button
                    type="submit"
                    disabled={mutation.isPending || content.length === 0 || content.length > 280}
                    className={`px-6 py-2 cursor-pointer text-white font-semibold rounded-full focus:outline-none transition-colors ${
                        mutation.isPending ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {mutation.isPending ? 'Posting...' : 'Post'}
                </button>
            </div>
            {mutation.isError && (
                <p className="text-center text-red-500 mt-4">Failed to create post. Try again later.</p>
            )}
        </form>
    );
}
