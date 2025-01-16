'use client';

import PostCard from './cardPost';
import CreatePost from './createPost';
import { FetchPosts } from '../hooks/fetchPosts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Post } from '../types';

export default function PostList() {
    const queryClient = useQueryClient();

    const { isLoading, error, data: posts } = useQuery({
        queryKey: ['posts'],
        queryFn: FetchPosts,
        staleTime: 30000,
        refetchInterval: 30000,
    });

    const handlePostCreated = (newPost: Post) => {
        queryClient.setQueryData<Post[]>(['posts'], (oldPosts = []) => [newPost, ...oldPosts]);
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    };

    const sortedPosts = posts?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                Ocorreu um erro ao carregar os posts. Tente novamente mais tarde.
            </div>
        );
    }

    return (
        <div>
            <CreatePost onPostCreated={handlePostCreated} />
            <div className="mt-6 space-y-6">
                {sortedPosts && sortedPosts.length > 0 ? (
                    sortedPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={FetchPosts}
                            onComment={FetchPosts}
                        />
                    ))
                ) : (
                    <p className="text-center">Nenhum post encontrado.</p>
                )}
            </div>
        </div>
    );
}
