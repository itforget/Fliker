import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold mb-6 text-blue-500">Welcome to Flicker</h1>
      <div className='flex flex-row space-x-4'>
        <div className="mb-4">
          <Link href="/register" className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600">Register</Link>
        </div>
        <div>
          <Link href="/login" className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600">Login</Link>
        </div>
      </div>
    </div>
  );
}