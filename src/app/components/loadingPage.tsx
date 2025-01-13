import { Spinner } from '@phosphor-icons/react';

export default function LoadingScreen () {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <Spinner size={40} className="animate-spin" />
        </div>
    );
};

