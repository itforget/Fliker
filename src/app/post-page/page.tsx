'use client'
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Post } from '../types';
import Sidebar from '../components/sideBar';
import PostCard from '../components/cardPost';
import CreatePost from '../components/createPost';
import LoadingScreen from '../components/loadingPage';
import useAuth from '../utils/auth';

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get('/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    }, []);

    const handlePostCreated = useCallback((newPost: Post) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [posts]);

    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) return <div>Redirecionando...</div>;

    return (
        <div className="flex">
            <Sidebar onLogout={handleLogout} />
            <div className="w-3/4 p-4 h-screen overflow-auto dark:bg-gray-950 text-gray-900 dark:text-white">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">O que está acontecendo?</h1>
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
        </div>
    );
}
