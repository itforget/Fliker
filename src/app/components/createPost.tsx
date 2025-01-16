import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../types';
import UseUser from '../hooks/useUser';
import { CreatePost } from '../hooks/createPostMutation';
import EmojiPicker from 'emoji-picker-react';

interface CreatePostFormProps {
    onPostCreated: (newPost: Post) => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const queryClient = useQueryClient();
    const { user } = UseUser();

    const mutation = useMutation({
        mutationKey: ['createPost'],
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

    const onEmojiClick = (emojiObject: any) => {
        setContent((prevContent) => prevContent + emojiObject.emoji);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg mt-6 dark:bg-gray-900 text-gray-900 dark:text-white"
        >
            <div className="relative">
                <textarea
                    id="content"
                    placeholder="What's happening?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 border dark:bg-gray-950 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    😊
                </button>
                {showEmojiPicker && (
                    <div className="absolute top-full right-0 mt-2 z-50">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
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