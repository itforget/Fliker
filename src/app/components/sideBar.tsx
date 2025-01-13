import Link from 'next/link';
import { HouseSimple, MagnifyingGlass, Bell, User, Power } from '@phosphor-icons/react';
import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react';
import ThemeToggle from './themeToggle';

interface SidebarProps {
    onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
    return (
        <div className="w-1/4 h-screen p-4 bg-gray-800 dark:bg-gray-900 text-white">
            <div className="flex flex-col space-y-6">
                <h1 className="text-3xl font-extrabold">W</h1>
                <nav className="space-y-4">
                    <div className="flex items-center space-x-3 hover:bg-blue-500 p-2 rounded-xl w-fit">
                        <HouseSimple className="h-6 w-6" />
                        <Link href="/">Início</Link>
                    </div>
                    <Popover className="relative">
                        <PopoverButton className="flex items-center space-x-3 hover:bg-blue-500 p-2 rounded-xl">
                            <Bell className="h-6 w-6" />
                            <span>Notificações</span>
                        </PopoverButton>
                        <PopoverPanel className="absolute left-0 top-full mt-2 z-10 w-64 p-4 bg-white text-black shadow-md rounded-lg">
                            <h3 className="font-semibold mb-2">Notificações</h3>
                            <p>Você não tem novas notificações.</p>
                        </PopoverPanel>
                    </Popover>
                    <Popover className="relative">
                        <PopoverButton className="flex items-center space-x-3 hover:bg-blue-500 p-2 rounded-xl">
                            <User className="h-6 w-6" />
                            <span>Perfil</span>
                        </PopoverButton>
                        <PopoverPanel className="absolute left-0 top-full mt-2 z-10 w-64 p-4 bg-white text-black shadow-md rounded-lg">
                            <h3 className="font-semibold mb-2">Gerenciar Perfil</h3>
                            <p></p>
                        </PopoverPanel>
                    </Popover>
                    <div className="flex flex-row items-center space-x-3">
                        <ThemeToggle />
                        <button
                            onClick={onLogout}
                            className="flex flex-row gap-2 items-center p-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <Power size={20} /> Sair
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    );
}