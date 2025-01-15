import Sidebar from '../components/sideBar';
import ListPosts from '../components/listPosts';

export default function PostsPage() {
    return (
        <div className="flex">
            <Sidebar  />
            <div className="w-3/4 p-4 h-screen overflow-auto dark:bg-gray-950 text-gray-900 dark:text-white">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">O que está acontecendo?</h1>
                <ListPosts />
            </div>
        </div>
    );
}
