'use client'
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CreatePost from '../components/createPost';
import { Post } from '../types';
import GiveLike from '../components/giveLike';
import CreateReplies from '../components/createReplies';
import { Bell, DevToLogo, HouseSimple, MagnifyingGlass, Spinner, User } from '@phosphor-icons/react';
import useAuth from '../utils/auth';
import Link from 'next/link';
import ThemeToggle from '../components/themeToggle';

// PostsPage Component
export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get('/api/posts');
            const sortedPosts = response.data.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    }, []);

    const handlePostCreated = useCallback((newPost: Post) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const { isAuthenticated } = useAuth();

    return (
        <div className="flex ">
            {isAuthenticated ? (
                <>
                    <div className="w-1/4 h-screen p-4 bg-gray-800 dark:bg-gray-900 text-white dark:text-white">
                        <div className="flex flex-col space-y-6">
                            <DevToLogo className="h-8 w-8" />
                            <nav className="space-y-4">
                                <div className="flex items-center space-x-3 hover:bg-blue-500 p-2 rounded-xl">
                                    <HouseSimple className="h-6 w-6" />
                                    <Link href="/">Início</Link>
                                </div>
                                <div className="flex items-center space-x-3 hover:bg-blue-500 p-2 rounded-xl">
                                    <MagnifyingGlass className="h-6 w-6" />
                                    <Link href="">Buscar</Link>
                                </div>
                                <div className="flex items-center space-x-3 hover:bg-blue-500 p-2 rounded-xl">
                                    <Bell className="h-6 w-6" />
                                    <Link href="">Notificações</Link>
                                </div>
                                <div className="flex items-center space-x-3 hover:bg-blue-500 p-2 rounded-xl">
                                    <User className="h-6 w-6" />
                                    <Link href="/perfil">Perfil</Link>
                                </div>
                                <div className="">
                                    <ThemeToggle />
                                </div>
                            </nav>
                        </div>
                    </div>

                    <div className="w-3/4 p-4 h-screen overflow-auto  dark:bg-gray-950 text-gray-900 dark:text-white">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">O que está acontecendo?</h1>
                        <CreatePost onPostCreated={handlePostCreated} />

                        <div className="mt-6 space-y-6 ">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-400 max-w-3xl mx-auto  dark:bg-gray-900 text-gray-900 dark:text-white"
                                    >
                                        <div className='flex flex-row items-center justify-between'>
                                            <div>
                                                <p className="mt-2 text-xl">{post.content}</p>
                                            </div>
                                            <GiveLike post={post} onLike={fetchPosts} />
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="text-sm">Respostas</h4>
                                            <ul className="space-y-4">
                                                {post.replies?.map((reply) => (
                                                    <li key={reply.id} className="border border-gray-300 rounded-xl p-2">
                                                        <p className="font-semibold text-sm ">
                                                            {reply.author ? reply.author.name.charAt(0).toUpperCase() + reply.author.name.slice(1) : 'Autor desconhecido'}
                                                        </p>
                                                        <p className="">{reply.content}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                            <CreateReplies post={post} onReply={fetchPosts} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center ">Nenhum post encontrado.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center w-full h-screen">
                    <Spinner size={40} className="animate-spin" />
                </div>
            )}
        </div>
    );
}
