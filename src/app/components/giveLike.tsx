import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../types';
import { Heart, Spinner } from '@phosphor-icons/react';
import UseUser from '../hooks/useUser';
import { giveLikeToPost } from '../hooks/giveLikeToPost'; 

interface GiveLikeProps {
    post: Post;
    onLike: () => void;
}

export default function GiveLike({ post, onLike }: GiveLikeProps) {
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { user } = UseUser();

    const mutation = useMutation({
        mutationFn: giveLikeToPost, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['likes', post.id] }); 
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            onLike(); 
        },
        onError: (error: unknown) => {
            console.error('Failed to give like:', error);
            setError('Failed to give like.');
        },
    });

    const handleGiveLike = () => {

        if (user?.id && post.id) {
            mutation.mutate({
                userId: user.id,
                postId: post.id,
            });
        }
    };

    return (
        <div className='flex flex-row items-center gap-2'>
            <button
                onClick={handleGiveLike}
                disabled={mutation.isPending}
                className={`transition-transform duration-300 ${mutation.isPending ? 'scale-95' : 'hover:scale-110'}`}
            >
                {mutation.isPending ? (
                    <Spinner className='animate-spin' size={24} />
                ) : (
                    <p className='flex flex-row items-center gap-1'>
                        <Heart className='text-red-500' size={24} /> {Array.isArray(post.likes) ? post.likes.length : 0}
                    </p>
                )}
            </button>
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}
