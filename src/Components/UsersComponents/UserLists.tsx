'use client';
import React from 'react';
import Button from '../Common/Button';

type User = { id: string; name: string };

interface Props {
    users: User[];
    onRemove: (id: string) => void;
    onEditStart: (id: string) => void;
    isLoading?: boolean;
}

const UserLists: React.FC<Props> = ({ users, onRemove, onEditStart, isLoading = false }) => {
    if (isLoading) {
        return (
            <ul className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                    <li
                        key={i}
                        className="flex justify-between items-center bg-gray-100 w-full rounded-md p-3 shadow-sm"
                    >
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="flex gap-2">
                            <div className="w-16 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-16 h-8 bg-gray-300 rounded-full"></div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    if (!users.length) {
        return <p className="text-center text-gray-500 italic mb-2">No users yet. Try adding one!</p>;
    }

    return (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
            {users.map(({ id, name }) => (
                <li
                    key={id}
                    className="flex justify-between items-center text-slate-800 w-full rounded-md p-3 transition-all shadow-sm hover:bg-slate-100"
                >
                    <span className="text-gray-800 flex-1 break-words">{name}</span>
                    <div className="flex gap-2 ml-3">
                        <Button
                            onClick={() => onEditStart(id)}
                            className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-xs sm:text-sm px-4 py-2"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => onRemove(id)}
                            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs sm:text-sm px-4 py-2"
                        >
                            Delete
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default UserLists;
