import { UserCircle, Chat } from '@phosphor-icons/react';
import GiveLike from './giveLike';
import CreateComments from './createComments';
import { Post } from '../types';
import ReactPlayer from 'react-player';
import VideoViewer from './videoViewer';

interface PostCardProps {
    post: Post;
    onLike: () => void;
    onComment: () => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-400 max-w-3xl mx-auto dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="flex flex-row items-center justify-between dark:bg-gray-700 p-2 rounded-xl border border-gray-300">
                <div className="flex flex-row items-center gap-2 p-4 w-full">
                    <div className="flex flex-col items-center p-2 dark:bg-gray-800 rounded-md">
                        <UserCircle size={60} />
                        <p className="text-xl font-bold">
                            {post.author ? post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1) : 'Autor desconhecido'}
                        </p>
                    </div>
                    <p>👉</p>
                    <div className="text-xl flex flex-col gap-2 items-center flex-1">
                        <p className="text-center">{post.content}</p>
                        {post.videoUrl && (
                            <div className="w-full max-w-full overflow-hidden">
                                <VideoViewer mediaUrl={post.videoUrl} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <GiveLike post={post} onLike={onLike} />
                    <p className="flex flex-row gap-1 items-center">
                        <Chat size={24} />
                        {post.comments?.length}
                    </p>
                </div>
            </div>
            <CreateComments post={post} onComment={onComment} />
        </div>
    );
};
