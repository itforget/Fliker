'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Post } from '../types';
import PostCard from './cardPost';
import CreatePost from './createPost';

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get('/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePostCreated = useCallback((newPost: Post) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    }, []);

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [posts]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            <CreatePost onPostCreated={handlePostCreated} />
            <div className="mt-6 space-y-6">
                {sortedPosts.length > 0 ? (
                    sortedPosts.map((post) => (
                        <PostCard key={post.id} post={post} onLike={fetchPosts} onReply={fetchPosts} />
                    ))
                ) : (
                    <p className="text-center">Nenhum post encontrado.</p>
                )}
            </div>
        </div>
    );
}
